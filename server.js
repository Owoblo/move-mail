const express = require('express');
const stripe = require('stripe')('YOUR_SECRET_KEY'); // Replace with your Stripe secret key
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Path to your service account key
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com' // Replace with your database URL
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { amount, userId } = req.body; // Amount in cents and user ID

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Credits Purchase',
                },
                unit_amount: amount,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `http://localhost:3000/success?userId=${userId}&amount=${amount}`, // Adjust the URL as needed
        cancel_url: 'http://localhost:3000/cancel', // Adjust the URL as needed
    });

    res.json({ id: session.id });
});

// Handle success
app.get('/success', async (req, res) => {
    const userId = req.query.userId; // Get user ID from query
    const amount = req.query.amount; // Get amount from query
    const creditsToAdd = calculateCredits(amount); // Calculate credits based on amount

    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({
        credits: admin.firestore.FieldValue.increment(creditsToAdd),
    });

    res.redirect('http://localhost:3000/dashboard'); // Redirect to dashboard
});

// Function to calculate credits based on amount
function calculateCredits(amount) {
    if (amount == 10000) return 180; // $100
    if (amount == 20000) return 400; // $200
    if (amount == 100000) return 2200; // $1000
    return 0; // Default for custom amounts
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

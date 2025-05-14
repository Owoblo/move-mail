// main.js
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

console.log("Initializing Supabase...");

// Check if the current URL matches the invite pattern
if (window.location.pathname.startsWith('/invite')) {
    window.location.href = '/signup.html'; // Adjust the path if necessary
}

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzG2eOicBvLEtNbqqdtFjnDD2HwDZqOTI",
    authDomain: "movemail-bc958.firebaseapp.com",
    projectId: "movemail-bc958",
    storageBucket: "movemail-bc958.firebasestorage.app",
    messagingSenderId: "420760181763",
    appId: "1:420760181763:web:4e70db9d2464cce14a8236",
    measurementId: "G-XE867G9K73"
  };
  


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

console.log("Supabase client initialized successfully.");

let currentPage = 1;
const recordsPerPage = 10;

async function fetchLeads() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block'; // Show loading indicator

    console.log("Fetching leads from Supabase...");

    try {
        const { data, error } = await supabase
            .from('sold_listings')
            .select('*')
            .range((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage - 1);

        if (error) {
            throw new Error(`Error fetching leads: ${error.message}`);
        }

        console.log("Fetched leads:", data); // Log the fetched data

        const leadsContainer = document.getElementById('leadsContainer');
        leadsContainer.innerHTML = ''; // Clear existing content

        if (data.length === 0) {
            leadsContainer.innerHTML = '<tr><td colspan="4" class="text-center">No leads available.</td></tr>';
            return;
        }

        data.forEach(lead => {
            const leadCard = document.createElement('tr');
            leadCard.innerHTML = `
                <td class="py-2 px-4 border-b">${lead.id}</td>
                <td class="py-2 px-4 border-b">${lead.address}</td>
                <td class="py-2 px-4 border-b">$${lead.price}</td>
                <td class="py-2 px-4 border-b">${lead.city}</td>
            `;
            leadsContainer.appendChild(leadCard);
        });

        updatePaginationControls(); // Call to update pagination controls
    } catch (error) {
        console.error('Error in fetchLeads:', error);
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
}

function updatePaginationControls() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing pagination

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1; // Disable if on the first page
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchLeads(); // Fetch leads for the new page
        }
    };
    paginationContainer.appendChild(prevButton);

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => {
        currentPage++;
        fetchLeads(); // Fetch leads for the new page
    };
    paginationContainer.appendChild(nextButton);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");
    const userName = sessionStorage.getItem('userName');
    if (userName) {
        document.getElementById('welcomeMessage').textContent = `Welcome, ${userName}`;
    }

    // Initialize credits
    let credits = parseInt(sessionStorage.getItem('credits')) || 0;
    document.getElementById('credits').textContent = credits;

    // Fetch leads when the page loads
    fetchLeads();

    // Fetch and populate provinces when the dashboard loads
    fetchProvinces();

    const userId = sessionStorage.getItem('userId'); // Get user ID from session storage
    if (!userId) {
        console.error('User ID is not found in session storage.');
        alert('User is not logged in. Please log in again.');
        window.location.href = 'signin.html'; // Redirect to sign-in page if user ID is not found
        return;
    }
    fetchUserPreferences(userId); // Fetch user preferences
});

// Firebase Auth State Change Listener
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const userRef = firebase.firestore().collection("users").doc(user.uid);

        // Check if the user already exists
        const doc = await userRef.get();
        if (!doc.exists) {
            // If not, create a new entry with 0 credits
            await userRef.set({
                email: user.email,
                credits: 0,
            });
            console.log(`User ${user.email} created with 0 credits.`);
            document.getElementById('credits').textContent = '0'; // Update credits display
        } else {
            // Fetch user data
            const userData = doc.data();
            const credits = userData.credits || 0; // Default to 0 if credits is undefined
            console.log(`User ${user.email} has ${credits} credits.`);
            document.getElementById('credits').textContent = credits; // Update credits display
        }
        fetchLeads(); // Fetch leads if the user is signed in
    } else {
        // Redirect to sign-in page if not authenticated
        window.location.href = 'signin.html';
    }
});

async function fetchProvinces() {
    console.log('Fetching provinces...');
    const { data, error } = await supabase
        .from('cities')
        .select('province');

    if (error) {
        console.error('Error fetching provinces:', error);
        return;
    }

    // Extract unique provinces
    const uniqueProvinces = [...new Set(data.map(city => city.province))];

    const provinceSelect = document.getElementById('province-select');
    uniqueProvinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.innerText = province;
        provinceSelect.appendChild(option);
    });
}

async function fetchCitiesByProvince() {
    const province = document.getElementById('province-select').value;

    if (!province) {
        document.getElementById('city-checkboxes').innerHTML = ''; // Clear cities if no province is selected
        return;
    }

    const { data, error } = await supabase
        .from('cities') // Ensure this is the correct table name
        .select('*')
        .eq('province', province); // Fetch cities for the selected province

    if (error) {
        console.error('Error fetching cities:', error);
        return;
    }

    const cityCheckboxes = document.getElementById('city-checkboxes');
    cityCheckboxes.innerHTML = ''; // Clear previous cities

    data.forEach(city => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `city-${city.id}`;
        checkbox.value = city.id;

        const label = document.createElement('label');
        label.htmlFor = `city-${city.id}`;
        label.innerText = city.name;

        cityCheckboxes.appendChild(checkbox);
        cityCheckboxes.appendChild(label);
        cityCheckboxes.appendChild(document.createElement('br'));
    });
}

document.getElementById('city-selection-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const selectedCities = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const userId = sessionStorage.getItem('userId'); // Get user ID from session storage

    if (!userId) {
        console.error('User ID is not found in session storage.');
        alert('User is not logged in. Please log in again.');
        return; // Exit if user ID is not found
    }

    console.log('Selected Cities:', selectedCities);
    console.log('User ID:', userId);

    // Clear existing preferences for the user
    await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', userId);

    // Insert new preferences
    const { error } = await supabase
        .from('user_preferences')
        .insert(selectedCities.map(cityId => ({ user_id: userId, city_id: cityId })));

    if (error) {
        console.error('Error saving preferences:', error);
        alert('Failed to save preferences. Please try again.');
    } else {
        alert('Preferences saved successfully!');
    }
});

async function fetchUserPreferences(userId) {
    const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('city_id')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user preferences:', error);
        return;
    }

    const cityIds = preferences.map(pref => pref.city_id);
    cityIds.forEach(cityId => {
        const checkbox = document.getElementById(`city-${cityId}`);
        if (checkbox) {
            checkbox.checked = true; // Check the checkbox if the city is in user preferences
        }
    });
}

async function fetchUserListings(userId) {
    // Fetch user preferences
    const { data: preferences, error: prefError } = await supabase
        .from('user_preferences')
        .select('city_id') // Assuming city_id corresponds to city names
        .eq('user_id', userId);

    if (prefError) {
        console.error('Error fetching user preferences:', prefError);
        return;
    }

    // Assuming city_id contains the names of the cities
    const cityNames = preferences.map(pref => pref.city_id); // Get city names from preferences
    
    // Fetch listings based on selected cities
    const { data: listings, error: listingError } = await supabase
        .from('sold_listings') // Replace with your actual listings table name
        .select('*')
        .in('city', cityNames); // Use the city field in listings

    if (listingError) {
        console.error('Error fetching listings:', listingError);
        return;
    }

    // Display listings in the UI
    const listingsContainer = document.getElementById('listingsContainer'); // Ensure you have a container for listings
    listingsContainer.innerHTML = ''; // Clear existing listings

    listings.forEach(listing => {
        const listingElement = document.createElement('div');
        listingElement.innerHTML = `
            <h3>${listing.title}</h3>
            <p>${listing.description}</p>
            <p>Price: $${listing.price}</p>
            <p>City: ${listing.city}</p> <!-- Display the city -->
        `;
        listingsContainer.appendChild(listingElement);
    });
}

// Example of adjusting layout based on screen size
function adjustLayout() {
    if (window.innerWidth < 768) {
        // Adjust layout for mobile
        console.log("Mobile layout adjustments");
    } else {
        // Adjust layout for desktop
        console.log("Desktop layout adjustments");
    }
}

// Call adjustLayout on load and resize
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);

async function sortTable(column, order) {
    console.log(`Sorting by ${column} in ${order} order...`);
    
    // Fetch leads again with sorting
    const { data, error } = await supabase
        .from('sold_listings') // Replace with your table name
        .select('*')
        .order(column, { ascending: order === 'asc' }); // Sort based on the column and order

    if (error) {
        console.error('Error fetching sorted leads:', error);
        return;
    }

    const leadsContainer = document.getElementById('leadsContainer');
    leadsContainer.innerHTML = ''; // Clear existing content

    data.forEach(lead => {
        const leadCard = document.createElement('tr');
        leadCard.innerHTML = `
            <td class="py-2 px-4 border-b">${lead.id}</td>
            <td class="py-2 px-4 border-b">${lead.address}</td>
            <td class="py-2 px-4 border-b">$${lead.price}</td>
            <td class="py-2 px-4 border-b">${lead.addressCity}</td>
        `; // Adjust based on your table structure
        leadsContainer.appendChild(leadCard);
    });

    updatePagination(currentPage); // Update pagination after sorting
}

function signUp() {
    const name = document.getElementById('name').value; // Full name
    const company = document.getElementById('company').value; // Company name
    const email = document.getElementById('email').value; // Email
    const password = document.getElementById('password').value; // Password
    const phone = document.getElementById('phone').value; // Phone number
    const promoCode = document.getElementById('promoCode').value; // Promo code

    // Check if the email is already in use
    auth.fetchSignInMethodsForEmail(email)
        .then((signInMethods) => {
            if (signInMethods.length > 0) {
                // Email is already in use, redirect to sign-in page
                document.getElementById('message').textContent = 'This email is already in use. Please sign in.';
                window.location.href = 'signin.html';
            } else {
                // Proceed with user registration
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        // Store additional user details in Firestore
                        const userRef = db.collection("users").doc(user.uid);
                        const userData = {
                            fullName: name,
                            company: company,
                            phone: phone,
                            email: email,
                            credits: promoCode === 'FREE100' ? 100 : 0, // Add credits if promo code is valid
                        };

                        userRef.set(userData)
                            .then(() => {
                                // Redirect to sign-in page
                                window.location.href = 'signin.html';
                            })
                            .catch((error) => {
                                // Handle Firestore errors
                                document.getElementById('message').textContent = error.message;
                                console.error("Firestore error:", error.message);
                            });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // Display error message
                        document.getElementById('message').textContent = errorMessage;
                        console.error("Sign-up error:", errorCode, errorMessage);
                    });
            }
        })
        .catch((error) => {
            console.error("Error checking email:", error);
            document.getElementById('message').textContent = "An error occurred while checking the email.";
        });
}

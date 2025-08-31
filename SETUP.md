# MoveMail Pro - MVP Setup Guide

## 🚀 Quick Start

This guide will help you get your moving companies platform up and running as a working MVP.

## 📋 Prerequisites

- Supabase account (free tier works)
- Stripe account (for payments)
- Vercel account (for deployment)
- Domain name (already configured)

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Note down your project URL and anon key

### 1.2 Set Up Database
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `database-schema.sql`
4. Run the script to create all tables and functions

### 1.3 Configure Authentication
1. Go to Authentication > Settings
2. Enable Email confirmations (optional for MVP)
3. Set your site URL to your domain
4. Add redirect URLs:
   - `https://yourdomain.com/dashboard.html`
   - `https://yourdomain.com/signin.html`
   - `https://yourdomain.com/signup.html`

## 💳 Step 2: Stripe Setup

### 2.1 Get API Keys
1. Go to [stripe.com](https://stripe.com) and sign up/login
2. Go to Developers > API keys
3. Copy your Publishable key and Secret key

### 2.2 Configure Webhooks (Optional for MVP)
1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🌐 Step 3: Environment Configuration

### 3.1 Update config.js
Replace the placeholder values in `config.js`:

```javascript
const config = {
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_ANON_KEY: 'your-actual-anon-key',
    STRIPE_PUBLISHABLE_KEY: 'pk_live_your_stripe_key',
    // ... rest of config
};
```

### 3.2 Set Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Go to Settings > Environment Variables
3. Add:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## 🚀 Step 4: Deploy to Vercel

### 4.1 Connect Repository
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy

### 4.2 Configure Domain
1. In Vercel, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

## 🧪 Step 5: Test Your MVP

### 5.1 Test Authentication
1. Visit your domain
2. Try to sign up a new company
3. Verify the account is created in Supabase

### 5.2 Test Payment System
1. Sign in with a test account
2. Go to Buy Credits page
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify credits are added to the account

### 5.3 Test Leads System
1. Create some sample leads in Supabase
2. Verify they appear in the dashboard
3. Test filtering and sorting

## 📊 Database Structure

Your platform now has these main tables:

- **moving_companies**: Company profiles and trial status
- **leads**: Available moving leads
- **company_preferences**: Company service preferences
- **credit_transactions**: Credit purchase and usage history
- **lead_access_logs**: Track which leads companies access

## 🔑 Key Features Working

✅ **User Registration & Authentication**
✅ **1-Month Free Trial** (30 days, 50 starting credits)
✅ **Credit System** (1 credit = 1 lead access)
✅ **Payment Processing** (Stripe integration)
✅ **Leads Management** (view, filter, sort)
✅ **Company Preferences** (city/province selection)
✅ **Responsive Dashboard**

## 🚧 What to Customize

### 1. Lead Generation
- Set up automated lead scraping
- Integrate with real estate APIs
- Add lead quality scoring

### 2. Trial Management
- Add trial expiration notifications
- Implement automatic subscription upgrades
- Add trial extension options

### 3. Lead Access
- Implement lead preview system
- Add contact information unlocking
- Create lead booking system

## 🐛 Common Issues & Solutions

### Issue: Supabase connection fails
**Solution**: Check your config.js file and ensure Supabase URL and key are correct

### Issue: Payment fails
**Solution**: Verify Stripe keys are correct and environment variables are set in Vercel

### Issue: Authentication not working
**Solution**: Check Supabase authentication settings and redirect URLs

### Issue: Database tables not created
**Solution**: Run the database-schema.sql script in Supabase SQL Editor

## 📈 Next Steps for Growth

1. **Lead Generation**: Automate lead collection from real estate sources
2. **Analytics**: Add dashboard metrics and reporting
3. **Notifications**: Email/SMS alerts for new leads
4. **Mobile App**: React Native or PWA version
5. **API**: Public API for integrations
6. **Multi-language**: Support for different regions

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all configuration values
3. Check Supabase and Vercel logs
4. Ensure all environment variables are set

## 🎯 MVP Success Criteria

Your platform is MVP-ready when:
- ✅ Companies can sign up and get 1-month free trial
- ✅ Companies can purchase credits
- ✅ Companies can view and filter leads
- ✅ Payment system works end-to-end
- ✅ Basic dashboard shows company data
- ✅ Responsive design works on mobile

## 🚀 Launch Checklist

- [ ] Test signup flow end-to-end
- [ ] Test payment system with real cards
- [ ] Verify leads display correctly
- [ ] Test on mobile devices
- [ ] Check all pages load properly
- [ ] Verify domain and SSL work
- [ ] Test logout and session management

---

**You're now ready to launch your MVP!** 🎉

The platform provides moving companies with:
- Easy signup and 1-month free trial
- Simple credit-based lead access
- Professional payment processing
- Clean, responsive interface

Focus on getting your first 10-20 customers and iterate based on their feedback!

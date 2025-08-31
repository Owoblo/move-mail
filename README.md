# MoveMail Pro 🚚

**Professional platform for moving companies to access leads and grow their business**

## 🎯 What is MoveMail Pro?

MoveMail Pro is a comprehensive platform that connects moving companies with potential customers who are relocating. Companies get access to verified leads through a credit-based system, with a generous 1-month free trial to start.

## ✨ Key Features

- **🎁 1-Month Free Trial** - Every new company gets 30 days free with 50 starting credits
- **💳 Credit System** - Purchase credits to access exclusive leads (1 credit = 1 lead)
- **🔍 Smart Lead Management** - Filter leads by city, price, property type, and status
- **💳 Secure Payments** - Stripe-powered payment system for credit purchases
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🔐 Secure Authentication** - Supabase-powered user management
- **📊 Real-time Dashboard** - Track credits, leads, and company performance

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone <your-repo>
cd move-mail
npm install
```

### 2. Configure Environment
1. Copy `env-template.txt` to `.env`
2. Fill in your Supabase and Stripe credentials
3. Update `config.js` with your actual keys

### 3. Set Up Database
1. Run `database-schema.sql` in your Supabase SQL Editor
2. Run `sample-leads.sql` to populate with test data

### 4. Deploy
```bash
npm run build
# Deploy to Vercel or your preferred hosting
```

## 🏗️ Architecture

- **Frontend**: HTML + Tailwind CSS + Vanilla JavaScript
- **Backend**: Supabase (Database + Authentication + Real-time)
- **Payments**: Stripe
- **Hosting**: Vercel (recommended)
- **Database**: PostgreSQL (via Supabase)

## 📊 Database Schema

The platform uses these main tables:
- `moving_companies` - Company profiles and trial status
- `leads` - Available moving leads
- `company_preferences` - Service area preferences
- `credit_transactions` - Credit purchase/usage history
- `lead_access_logs` - Lead access tracking

## 💰 Pricing Structure

- **Starter**: $99 for 250 credits
- **Professional**: $299 for 1,000 credits (20% savings)
- **Enterprise**: $999 for 5,000 credits (33% savings)

## 🔧 Configuration Files

- `config.js` - Frontend configuration (Supabase, Stripe keys)
- `database-schema.sql` - Database structure and functions
- `sample-leads.sql` - Sample data for testing
- `SETUP.md` - Detailed setup instructions

## 🧪 Testing

### Test Cards (Stripe)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`

### Test Flow
1. Sign up a new company
2. Verify 1-month trial starts with 50 credits
3. Purchase credits using test card
4. Access leads and verify credit deduction

## 🚧 Development

### Local Development
```bash
npm run dev          # Watch Tailwind CSS
npm run build        # Build CSS
npm start           # Start local server
```

### File Structure
```
├── api/                    # Vercel serverless functions
├── css/                    # Tailwind source files
├── js/                     # JavaScript files
├── images/                 # Static images
├── *.html                  # Page templates
├── config.js               # Configuration
├── database-schema.sql     # Database setup
└── SETUP.md               # Setup guide
```

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Secure authentication with Supabase Auth
- Stripe-powered secure payments
- Environment variable protection
- CORS configuration

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 📈 Analytics & Monitoring

- Supabase dashboard for database metrics
- Stripe dashboard for payment analytics
- Vercel analytics for performance monitoring

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor Supabase usage and limits
- Check Stripe webhook delivery
- Review and update sample leads
- Monitor trial expiration rates

### Scaling Considerations
- Implement lead generation automation
- Add real-time notifications
- Create mobile app version
- Add multi-language support

## 🆘 Support

### Common Issues
1. **Authentication fails** - Check Supabase config and redirect URLs
2. **Payment errors** - Verify Stripe keys and webhook setup
3. **Database errors** - Ensure schema is properly created
4. **Styling issues** - Run `npm run build` to compile Tailwind

### Getting Help
- Check browser console for errors
- Verify all configuration values
- Review Supabase and Vercel logs
- Ensure environment variables are set

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎉 Success Metrics

Your MVP is ready when:
- ✅ Companies can sign up and get free trial
- ✅ Payment system works end-to-end
- ✅ Leads display and filter correctly
- ✅ Dashboard shows company data
- ✅ Mobile responsive design works
- ✅ Authentication flow is smooth

---

**Ready to launch your moving companies platform?** 🚀

Follow the `SETUP.md` guide to get everything configured and deployed. Focus on getting your first 10-20 customers and iterate based on their feedback!

For questions or support, check the setup guide or review the configuration files.

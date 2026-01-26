# Pre-Deployment Checklist

Use this checklist to ensure your site is ready for production deployment.

## 🔧 Configuration

- [ ] **Sanity Project Created**
  - Create project at https://www.sanity.io/manage
  - Or run: `npx sanity@latest init`
  - Save your Project ID

- [ ] **Sanity Schema Deployed**
  - Run: `npx sanity@latest schema deploy`
  - Verify schema in Sanity Studio

- [ ] **Resend Account Set Up**
  - Sign up at https://resend.com
  - Get API key from https://resend.com/api-keys
  - Verify domain or use `onboarding@resend.dev` for testing

- [ ] **Environment Variables Set Locally**
  - Copy `.env.example` to `.env.local`
  - Fill in all required values:
    - `NEXT_PUBLIC_SANITY_PROJECT_ID`
    - `NEXT_PUBLIC_SANITY_DATASET`
    - `RESEND_API_KEY`
    - `LEADS_TO_EMAIL`
    - `SMTP_FROM`

- [ ] **Environment Variables Set in Production**
  - Add all variables to hosting platform (Vercel/Netlify)
  - Verify no typos in variable names
  - Ensure NEXT_PUBLIC_ variables are set correctly

## ✅ Testing

- [ ] **Local Build Test**
  - Run: `npm run build`
  - Verify build completes without errors
  - Check for any warnings

- [ ] **Sanity Studio Access**
  - Visit: http://localhost:3000/studio
  - Verify you can log in
  - Test adding/removing booked dates

- [ ] **Booking Form**
  - Fill out and submit the booking form
  - Verify email is received at `LEADS_TO_EMAIL`
  - Test rate limiting (try submitting 6 times quickly)

- [ ] **Availability Calendar**
  - Add a booked date in Sanity Studio
  - Verify it appears disabled on the schedule page
  - Test that past dates are blocked

- [ ] **Image Gallery**
  - Check all images load correctly
  - Verify WebP format is being served
  - Test on different browsers
  - Verify orientation is correct (no rotated images)

- [ ] **Navigation**
  - Test all menu links work
  - Verify smooth page transitions
  - Check mobile menu functionality

- [ ] **Responsive Design**
  - Test on mobile devices
  - Check tablet view
  - Verify desktop layout

## 🚀 Deployment

- [ ] **Choose Hosting Platform**
  - Vercel (recommended for Next.js)
  - Netlify
  - Other platform

- [ ] **Connect Repository**
  - Link GitHub/GitLab repository
  - Or use CLI deployment

- [ ] **Set Build Commands**
  - Build: `npm run build`
  - Start: `npm start`
  - Install: `npm install`

- [ ] **Deploy**
  - Trigger deployment
  - Monitor build logs
  - Verify no errors

## 🔍 Post-Deployment Verification

- [ ] **Site Loads**
  - Visit your production URL
  - Verify homepage loads correctly

- [ ] **Sanity Studio in Production**
  - Visit: `your-domain.com/studio`
  - Log in and test functionality
  - Add a test booked date

- [ ] **Booking Form in Production**
  - Submit a test booking request
  - Verify email notification is received
  - Check email formatting

- [ ] **All Pages Load**
  - Home page: `/`
  - Gallery: `/gallery`
  - Schedule: `/schedule`
  - Availability: `/availability`
  - Booking: `/booking`
  - Payment: `/payment`
  - Style Lab: `/style-lab`
  - Studio: `/studio`

- [ ] **Performance Check**
  - Run Lighthouse audit
  - Check load times
  - Verify WebP images loading

- [ ] **Cross-Browser Testing**
  - Chrome
  - Firefox
  - Safari
  - Edge
  - Mobile browsers

## 📝 Documentation

- [ ] **README Updated**
  - Project description accurate
  - Installation steps clear
  - Environment variables documented

- [ ] **Deployment Guide Available**
  - PRODUCTION_DEPLOYMENT.md exists
  - Instructions are clear
  - Troubleshooting section helpful

- [ ] **Environment Variables Documented**
  - .env.example file present
  - All variables explained
  - No sensitive data committed

## 🔒 Security

- [ ] **.env.local Not Committed**
  - Check .gitignore includes `.env*`
  - Verify no secrets in repository

- [ ] **API Keys Secure**
  - Using environment variables
  - Not hardcoded anywhere
  - Production keys different from dev

- [ ] **Rate Limiting Enabled**
  - Booking form has rate limiting
  - Test limits work correctly

## 📊 Analytics & Monitoring (Optional)

- [ ] **Analytics Set Up**
  - Google Analytics
  - Vercel Analytics
  - Or other service

- [ ] **Error Monitoring**
  - Sentry
  - LogRocket
  - Or other service

- [ ] **Uptime Monitoring**
  - UptimeRobot
  - Pingdom
  - Or other service

## ✨ Nice-to-Have

- [ ] **Custom Domain Configured**
  - Domain purchased
  - DNS configured
  - SSL certificate active

- [ ] **SEO Optimization**
  - Meta tags added
  - Open Graph tags
  - Sitemap generated

- [ ] **Social Media Links**
  - Instagram button configured
  - Other social links added

- [ ] **Contact Information**
  - Phone number
  - Email address
  - Physical address

---

## 🆘 Having Issues?

Refer to [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for troubleshooting guidance.

Common issues:
1. Build fails → Check Sanity environment variables
2. Emails not sending → Verify Resend API key
3. Studio won't load → Deploy schema with `npx sanity@latest schema deploy`
4. Images not loading → Check WebP files exist in `/public/images/`

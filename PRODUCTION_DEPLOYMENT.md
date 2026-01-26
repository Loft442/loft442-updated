# Production Deployment Guide

## Prerequisites

Before deploying to production, you need to set up the following services:

### 1. Sanity CMS Setup (Required)
The site uses Sanity CMS to manage booked dates for the availability calendar.

**Option A: Create New Sanity Project**
```bash
npx sanity@latest init
```
Follow the prompts and note your Project ID.

**Option B: Use Existing Project**
If you already have a Sanity project, get your Project ID from: https://www.sanity.io/manage

**Schema Setup:**
The schema for availability is already configured in `/sanity/schemaTypes/availability.ts`. You'll need to deploy it:

```bash
npx sanity@latest schema deploy
```

### 2. Resend Email Service Setup (Required for Booking Form)
The booking form uses Resend to send email notifications.

1. Sign up at: https://resend.com
2. Get your API key from: https://resend.com/api-keys
3. Verify your domain (or use `onboarding@resend.dev` for testing)

## Environment Variables

### Local Development (.env.local)
Copy and fill in these values in your `.env.local` file:

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here
LEADS_TO_EMAIL=your-email@example.com
SMTP_FROM=Loft 442 <onboarding@resend.dev>
```

### Production Deployment
Set the same environment variables in your hosting platform:

**Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the variables from above

**Netlify:**
1. Go to Site settings > Environment variables
2. Add all the variables from above

**Other platforms:**
Refer to your hosting provider's documentation for setting environment variables.

## Build and Deploy

### Test Production Build Locally
```bash
npm run build
```

This will create an optimized production build. Fix any errors before deploying.

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository at: https://vercel.com/new

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or connect your GitHub repository at: https://app.netlify.com/

## Post-Deployment Checklist

- [ ] Verify Sanity Studio is accessible at: `your-domain.com/studio`
- [ ] Test the booking form by submitting a request
- [ ] Check that email notifications are being sent
- [ ] Verify the availability calendar displays correctly
- [ ] Test image loading and WebP optimization
- [ ] Check past dates are properly blocked in the schedule
- [ ] Test navigation and all page routes
- [ ] Verify mobile responsiveness

## Sanity Studio Access

The Sanity Studio is embedded in your site at `/studio`. To access it:
1. Navigate to: `https://your-domain.com/studio`
2. Log in with your Sanity account
3. Manage booked dates in the "Availability" document

## Managing Booked Dates

1. Go to `/studio` on your deployed site
2. Find the "Availability" document
3. Add/remove dates in the `bookedDates` array
4. Dates should be in YYYY-MM-DD format
5. Changes reflect immediately on the booking calendar

## Troubleshooting

### Build fails with "Configuration must contain `projectId`"
- Make sure `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in your environment variables
- The variable must be set in your hosting platform's settings, not just `.env.local`

### Booking form returns 500 error
- Verify all Resend environment variables are set correctly
- Check that your Resend API key is valid
- Ensure the FROM email is verified in Resend

### Sanity Studio won't load
- Verify your Sanity project ID and dataset are correct
- Make sure you've deployed your schema: `npx sanity@latest schema deploy`
- Check that you're logged into Sanity

### Images not loading
- All images should be in WebP format in `/public/images/`
- Verify the build process didn't exclude the images
- Check browser console for 404 errors

## Performance Optimizations Already Implemented

✅ All gallery images converted to WebP (85% quality)
✅ Image orientation fixes applied
✅ Gallery animations optimized (0.2s transitions)
✅ Past dates blocked in booking calendar
✅ Rate limiting on booking form (5 requests per 10 minutes per IP)
✅ Next.js automatic code splitting and optimization

## Support

For issues specific to:
- **Next.js**: https://nextjs.org/docs
- **Sanity**: https://www.sanity.io/docs
- **Resend**: https://resend.com/docs

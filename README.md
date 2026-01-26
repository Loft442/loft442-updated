# Loft 442 - Event Venue Website

A modern, high-performance Next.js website for Loft 442 event venue featuring:
- WebP optimized image gallery
- Real-time availability calendar with Sanity CMS
- Booking form with email notifications via Resend
- Responsive design with smooth animations

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Usually "production"
- `RESEND_API_KEY` - Your Resend API key
- `LEADS_TO_EMAIL` - Email to receive booking requests
- `SMTP_FROM` - From email address

### 3. Set Up Sanity CMS
Initialize Sanity (if you haven't already):
```bash
npx sanity@latest init
```

Deploy the schema:
```bash
npx sanity@latest schema deploy
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

Access Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio)

## Project Structure

- `/app` - Next.js 16 app directory with pages and API routes
- `/src/components` - React components
- `/public/images` - WebP optimized gallery images
- `/sanity` - Sanity CMS configuration and schemas
- `/src/lib` - Utility functions and client configurations

## Key Features

### WebP Image Optimization
All gallery images have been converted to WebP format for optimal performance:
- 85% quality setting
- ~25-35% file size reduction
- EXIF orientation properly applied

### Availability Calendar
- Powered by Sanity CMS
- Real-time booked date management
- Past dates automatically blocked
- Integrates with booking form

### Booking Form
- Email notifications via Resend
- Rate limiting (5 requests per 10 minutes per IP)
- Form validation and error handling

### Smooth Animations
- Gallery reveal animations (0.2s)
- Page transitions
- Responsive interactions

## Production Deployment

See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Don't forget to set your environment variables in Vercel's project settings!

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Resend Documentation](https://resend.com/docs)

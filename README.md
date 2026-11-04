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

## Uploading Photos & Videos to the Gallery

1. Go to `/studio` on the live site (e.g. `https://loft442.com/studio`) and sign in with your Sanity account.
2. The **Upload** tab opens first. It has one column per gallery section: **Weddings, Private Events, Birthdays and Baby Showers** (the same tabs as the website's gallery).
3. Optionally type a **Description for this batch**; otherwise one is filled in automatically (e.g. "Wedding celebration at Loft 442").
4. Drag photos and videos onto the drop zone under the right column (or click it to choose files). Uploads run three at a time; failed ones can be retried.
5. New uploads are saved as drafts under **Waiting to publish**. They are not on the website until you click **Publish** (or **Publish all**). Use **Delete** to discard one. Individual descriptions or categories can be edited from the **Structure → Gallery** list before publishing.
6. To **move** a photo to another category or **delete** it from the website, open **On the website** at the bottom of its column, then use **Move to…** or **Delete**. This works for every photo, including the site's original ones.

First-time setup: the site's original gallery photos were built into the code. The Upload page shows an **Import existing photos** button until they have been copied into Sanity (one click, done once). After that, Sanity is the single source for the gallery; the built-in list is only used if Sanity can't be reached.

Notes:
- Anyone uploading needs a Sanity account invited to the project (Sanity → Manage → Members). The *Editor* role can upload and publish.
- Published items appear on `/gallery` within about a minute when the Sanity webhook is set up (POST to `/api/revalidate-gallery`, signed with `SANITY_REVALIDATE_SECRET`, filter `_type in ["galleryItem", "galleryImport"]`). Without the webhook they appear within an hour.
- Keep videos short (under about 100 MB) so they load quickly for visitors.

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

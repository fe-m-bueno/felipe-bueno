# Felipe Bueno - Portfolio

Personal portfolio built with Next.js 16, showcasing my projects and professional experience as a fullstack developer.

## About the Project

This is a modern, responsive portfolio site that uses recent web technologies to deliver a smooth and engaging experience. The project includes internationalization (i18n), an integration with the Last.fm API to display recently played tracks, and a working contact system.

## Key Features

- Responsive design with smooth animations using Framer Motion
- Light/dark theme support
- Internationalization (Portuguese and English)
- Last.fm integration to display music activity
- Working contact form with validation
- Projects section with filters and categorization
- SEO optimized with structured metadata
- Analytics and performance metrics with Vercel

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- i18next (internationalization)

### Backend

- Next.js API Routes
- Nodemailer / Resend (email delivery)
- Zod (schema validation)

### Tools and Libraries

- Lucide React (icons)
- Iconify (icon library)
- Vercel Analytics & Speed Insights
- Embla Carousel

## Installation and Running

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/felipe-bueno.git
cd felipe-bueno
npm install
```

### Environment Variables

Create a `.env.local` file at the project root with the following variables:

```bash
# Email configuration
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password

# Last.fm API (optional)
LASTFM_API_KEY=your-api-key
LASTFM_USERNAME=your-username
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

To generate the optimized build:

```bash
npm run build
npm start
```

## Project Structure

```
felipe-bueno/
├── app/                    # Routes and pages (App Router)
│   ├── api/               # API routes
│   ├── projects/          # Projects page
│   └── layout.tsx         # Main layout
├── components/            # Reusable React components
├── data/                  # Static data (projects, experience)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
├── locales/               # Translation files (i18n)
│   ├── en/
│   └── pt/
├── public/                # Static assets
└── utils/                 # Utility functions
```

## Deployment

The project is configured for automatic deployment on Vercel. Any push to the main branch triggers a new deployment.

To deploy manually:

```bash
vercel --prod
```

## License

This project is for personal use. All rights reserved.

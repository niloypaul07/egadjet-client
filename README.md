# eGadjet Client

AI-powered gadget ecommerce frontend built with Next.js, Tailwind CSS, TanStack Query, and Recharts.

## Setup

1. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app runs at `http://localhost:3000`.

## Prerequisites

- Node.js 18+
- MongoDB running locally
- eGadjet server running on port 5000

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |

## Features

- Landing page with 9 sections (Hero, Features, Categories, Featured Products, Statistics, AI Highlight, Testimonials, FAQ, CTA)
- Explore page with search, filtering (category, brand, price, rating), sorting, and pagination
- Gadget detail pages with specs, reviews, and related items
- JWT + Google authentication with demo login
- Protected Add/Manage Items pages
- AI Shopping Assistant with LLM integration
- About, Contact, Blog, Privacy, and Terms pages

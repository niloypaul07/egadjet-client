# eGadjet - AI-Powered Gadget Marketplace (Client)

A modern, full-stack e-commerce platform for buying and selling tech gadgets, powered by AI shopping assistant with real-time streaming responses.

## 🌐 Live Demo

**Frontend:** [https://egadjet-client.vercel.app](https://egadjet-client.vercel.app)

**Backend API:** [https://egadjet-server.vercel.app](https://egadjet-server.vercel.app)

## ✨ Features

### Core Functionality
- 🛍️ **Product Marketplace** - Browse, search, and filter tech gadgets
- 🤖 **AI Shopping Assistant** - Groq-powered LLM with streaming responses and intelligent product recommendations
- 🔐 **Authentication** - Email/password and Google OAuth sign-in
- 🛒 **Shopping Cart** - Add to cart with quantity management
- 💳 **Checkout System** - Complete order flow with multiple payment options
- ⭐ **Product Reviews** - Rate and review purchased products
- 📊 **User Dashboard** - Manage your products, orders, and profile

### AI Features
- Real-time streaming responses using SSE (Server-Sent Events)
- Conversation history and context awareness
- Smart product recommendations based on budget and preferences
- Follow-up question suggestions
- Fallback catalog search with intelligent scoring

### User Experience
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast page loads with Next.js 15
- 🔄 Seamless redirect flow (checkout → login → back to checkout)
- 💾 Persistent cart across sessions

## 🏗️ Tech Stack

- **Framework:** Next.js 15.5.20 (App Router)
- **Language:** JavaScript (React 19)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts
- **Authentication:** JWT + Google OAuth (@react-oauth/google)
- **API Client:** Axios
- **Image Optimization:** Next.js Image component
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+ or Node.js 20+
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/niloypaul07/egadjet-client.git
cd egadjet-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Getting Google Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:3001` (development)
   - `https://egadjet-client.vercel.app` (production)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

**Note:** Make sure the backend server is running on `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
egadjet-client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── assistant/         # AI Chat Assistant
│   │   ├── blog/              # Blog page
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── contact/           # Contact page
│   │   ├── explore/           # Product listing with filters
│   │   ├── gadgets/[id]/      # Product details
│   │   ├── items/             # Product management
│   │   │   ├── add/          # Add new product
│   │   │   ├── edit/[id]/    # Edit product
│   │   │   └── manage/       # Manage products
│   │   ├── login/             # Login page
│   │   ├── privacy/           # Privacy policy
│   │   ├── register/          # Registration
│   │   ├── terms/             # Terms of service
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── gadgets/           # Product cards
│   │   └── layout/            # Header, Footer, etc.
│   ├── providers/             # React Context providers
│   │   ├── AuthProvider.js   # Authentication state
│   │   ├── CartProvider.js   # Shopping cart state
│   │   └── Providers.js      # Provider wrapper
│   └── lib/
│       └── api.js             # Axios instance & interceptors
├── public/                     # Static assets
├── .env.local                 # Environment variables (local)
├── .env.production            # Environment variables (production)
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies
```

## 🎯 Key Routes

### Public Routes (No Authentication Required)
- `/` - Home page with featured products
- `/explore` - Browse all products with filters
- `/about` - About eGadjet
- `/blog` - Blog posts
- `/contact` - Contact information
- `/gadgets/[id]` - Product details
- `/login` - Sign in
- `/register` - Create account

### Protected Routes (Authentication Required)
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/assistant` - AI Shopping Assistant
- `/items/add` - Add new product
- `/items/manage` - Manage your products
- `/items/edit/[id]` - Edit product

## 🔑 Demo Credentials

```
Email: demo@egadjet.com
Password: demo123
```

Or use the **"Demo Login (Auto-fill)"** button on the login page.

## 🌟 Features Breakdown

### AI Shopping Assistant (`/assistant`)
- Real-time streaming responses using Groq + Llama 3.3 70B
- Server-Sent Events (SSE) for smooth streaming
- Conversation history
- Smart product recommendations
- Follow-up question suggestions
- Typing indicator

### Product Management
- Add products with images, specifications, pricing
- Edit existing products
- Delete products
- Stock management
- Featured product toggle

### Shopping Experience
- Advanced filtering (category, brand, price range, rating)
- Search functionality
- Add to cart with quantity control
- Persistent cart (localStorage)
- Checkout with shipping address
- Multiple payment methods

### Authentication Flow
- Email/password registration and login
- Google OAuth integration
- JWT token-based authentication
- Automatic token refresh
- Protected route handling
- Redirect to checkout after login

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server (port 3001)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - `NEXT_PUBLIC_API_URL` → `https://egadjet-server.vercel.app/api`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → Your Google Client ID

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

## 📦 Dependencies

### Core
- `next` - React framework
- `react` & `react-dom` - UI library
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `recharts` - Charts and graphs
- `@react-oauth/google` - Google authentication

## 🔗 Related Repositories

- **Backend API:** [egadjet-server](https://github.com/niloypaul07/egadjet-server)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Niloy Paul**
- GitHub: [@niloypaul07](https://github.com/niloypaul07)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email niloypaul07@example.com or open an issue on GitHub.

---

Made with ❤️ by Niloy Paul

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '@/lib/api';
import GadgetCard, { GadgetCardSkeleton } from '@/components/gadgets/GadgetCard';

const heroSlides = [
  {
    title: 'Next-Gen Smartphones',
    subtitle: 'Flagship devices with AI-powered photography and blazing performance.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    cta: '/explore?category=Smartphones',
  },
  {
    title: 'Pro Laptops & Creators',
    subtitle: 'Power your workflow with M-series MacBooks and premium Windows machines.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
    cta: '/explore?category=Laptops',
  },
  {
    title: 'Immersive Gaming Gear',
    subtitle: 'Consoles, peripherals, and rigs built for competitive edge.',
    image: 'https://images.unsplash.com/photo-1606814894318-7ff589968340?w=1200&q=80',
    cta: '/explore?category=Gaming',
  },
];

const features = [
  {
    icon: '🤖',
    title: 'AI Shopping Assistant',
    description: 'Get personalized gadget recommendations powered by advanced LLM technology.',
  },
  {
    icon: '✅',
    title: 'Verified Authenticity',
    description: 'Every product is sourced from authorized distributors with warranty coverage.',
  },
  {
    icon: '🚀',
    title: 'Express Delivery',
    description: 'Same-day delivery in Dhaka and 24-48 hour shipping nationwide.',
  },
  {
    icon: '💳',
    title: 'Flexible Payments',
    description: 'Pay with cards, mobile banking, or interest-free installment plans.',
  },
];

const categories = [
  { name: 'Smartphones', icon: '📱', href: '/explore?category=Smartphones', color: 'bg-blue-50 text-primary' },
  { name: 'Laptops', icon: '💻', href: '/explore?category=Laptops', color: 'bg-amber-50 text-accent-dark' },
  { name: 'Audio', icon: '🎧', href: '/explore?category=Audio', color: 'bg-purple-50 text-purple-600' },
  { name: 'Gaming', icon: '🎮', href: '/explore?category=Gaming', color: 'bg-green-50 text-green-600' },
  { name: 'Wearables', icon: '⌚', href: '/explore?category=Wearables', color: 'bg-rose-50 text-rose-600' },
  { name: 'Smart Home', icon: '🏠', href: '/explore?category=Smart Home', color: 'bg-cyan-50 text-cyan-600' },
];

const testimonials = [
  {
    name: 'Rahim Khan',
    role: 'Software Engineer, Dhaka',
    text: 'The AI assistant helped me pick the perfect laptop for development under my budget. Saved hours of research!',
    rating: 5,
  },
  {
    name: 'Sadia Rahman',
    role: 'Content Creator, Chittagong',
    text: 'Fast delivery and genuine products. My iPhone 15 Pro arrived sealed with full warranty. Highly recommend eGadjet.',
    rating: 5,
  },
  {
    name: 'Tanvir Ahmed',
    role: 'Gamer, Sylhet',
    text: 'Best place for gaming gear in Bangladesh. The PS5 Slim deal was unbeatable and customer support is excellent.',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'How does the AI Shopping Assistant work?',
    a: 'Our AI assistant analyzes your preferences, budget, and use case to recommend the best gadgets from our catalog. It can compare products, explain specs, and answer technical questions in real time.',
  },
  {
    q: 'Are all products authentic with warranty?',
    a: 'Yes. Every gadget on eGadjet is sourced from authorized distributors. All products include manufacturer warranty and our 7-day return policy.',
  },
  {
    q: 'What are the delivery options?',
    a: 'We offer same-day delivery in Dhaka for orders placed before 2 PM. Nationwide delivery takes 24-48 hours via our partner courier network.',
  },
  {
    q: 'Can I sell my gadgets on eGadjet?',
    a: 'Registered users can list gadgets through the Add Item page. All listings are reviewed for quality and authenticity before going live.',
  },
];

const COLORS = ['#2563EB', '#F59E0B', '#0F172A', '#3B82F6', '#D97706', '#64748B', '#1E293B'];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-slate">
      <div className="absolute inset-0">
        <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-slate via-slate/90 to-slate/60" />
      </div>

      <div className="container-main relative z-10 py-16">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
            AI-Powered Shopping Experience
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-4 text-lg text-slate-300">{slide.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={slide.cta} className="btn-accent">
              Shop Now
            </Link>
            <Link href="/assistant" className="btn-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20">
              Try AI Assistant
            </Link>
          </div>
        </div>

        <div className="mt-10 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-accent' : 'w-2 bg-white/40'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-gadgets'],
    queryFn: async () => {
      const { data } = await api.get('/gadgets/featured');
      return data.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get('/gadgets/stats');
      return data.data;
    },
  });

  const pieData =
    stats?.categoryStats?.map((c) => ({ name: c._id, value: c.count })) || [];

  return (
    <>
      <HeroSection />

      {/* Features */}
      <section className="py-20">
        <div className="container-main">
          <div className="text-center">
            <h2 className="section-title">Why Choose eGadjet</h2>
            <p className="section-subtitle mx-auto">
              Combining cutting-edge AI with premium gadget curation for a smarter shopping experience.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card-base p-6 text-center">
                <span className="text-4xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="container-main">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our curated collections of premium tech gadgets.</p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`card-base flex flex-col items-center p-6 transition hover:-translate-y-1 hover:shadow-lg ${cat.color}`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="mt-3 text-sm font-semibold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-main">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title">Featured Gadgets</h2>
              <p className="section-subtitle">Hand-picked premium devices loved by our customers.</p>
            </div>
            <Link href="/explore" className="btn-secondary hidden sm:inline-flex">
              View All
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredLoading
              ? Array.from({ length: 4 }).map((_, i) => <GadgetCardSkeleton key={i} />)
              : featured?.slice(0, 4).map((g) => <GadgetCard key={g._id} gadget={g} />)}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-slate py-20 text-white">
        <div className="container-main">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Trusted by Tech Enthusiasts</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              Real numbers from our growing community of gadget lovers across Bangladesh.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Products Listed', value: stats?.totalGadgets || '12+' },
              { label: 'Customer Reviews', value: stats?.totalReviews || '500+' },
              { label: 'Happy Customers', value: '12,500+' },
              { label: 'Average Rating', value: `${stats?.avgRating || 4.7}/5` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-card bg-slate-light p-6 text-center">
                <p className="text-3xl font-bold text-accent">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>

          {pieData.length > 0 && (
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-card bg-slate-light p-6">
                <h3 className="mb-4 text-lg font-semibold">Products by Category</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-card bg-slate-light p-6">
                <h3 className="mb-4 text-lg font-semibold">Monthly Listings</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats?.monthlySales || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI Highlight */}
      <section className="py-20">
        <div className="container-main">
          <div className="card-base overflow-hidden lg:flex">
            <div className="relative min-h-[300px] flex-1 bg-gradient-to-br from-primary to-primary-dark p-8 lg:p-12">
              <div className="relative z-10">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                  Agentic AI
                </span>
                <h2 className="mt-4 text-3xl font-bold text-white">Meet Your AI Shopping Agent</h2>
                <p className="mt-3 max-w-md text-blue-100">
                  Ask questions, compare products, get budget-friendly recommendations, and make confident purchase
                  decisions — all powered by advanced language models.
                </p>
                <Link href="/assistant" className="btn-accent mt-6 inline-flex">
                  Start Conversation
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            </div>
            <div className="flex-1 space-y-4 p-8 lg:p-12">
              {[
                'Find me a laptop under $1500 for video editing',
                'Compare iPhone 15 Pro vs Galaxy S24 Ultra',
                'Best noise-canceling headphones for travel?',
              ].map((q) => (
                <div key={q} className="rounded-card border border-slate/5 bg-neutral-50 px-4 py-3 text-sm text-slate-muted">
                  &ldquo;{q}&rdquo;
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="container-main">
          <h2 className="section-title text-center">What Our Customers Say</h2>
          <p className="section-subtitle mx-auto text-center">
            Join thousands of satisfied tech enthusiasts across Bangladesh.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card-base p-6">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-accent text-accent" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-muted">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 border-t border-slate/5 pt-4">
                  <p className="text-sm font-semibold text-slate">{t.name}</p>
                  <p className="text-xs text-slate-muted">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container-main max-w-3xl">
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="card-base group">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-slate marker:content-none">
                  <div className="flex items-center justify-between">
                    {faq.q}
                    <span className="text-primary transition group-open:rotate-45">+</span>
                  </div>
                </summary>
                <p className="border-t border-slate/5 px-6 py-4 text-sm leading-relaxed text-slate-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-20">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Upgrade Your Tech?</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Explore our curated collection of premium gadgets or let our AI assistant find the perfect match for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/explore" className="btn-accent">
              Browse Gadgets
            </Link>
            <Link href="/assistant" className="btn-secondary !border-white !bg-white !text-primary hover:!bg-white/90">
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

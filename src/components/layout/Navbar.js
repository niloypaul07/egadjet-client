'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const authLinks = [
  { href: '/assistant', label: 'AI Assistant' },
  { href: '/items/add', label: 'Add Item' },
  { href: '/items/manage', label: 'Manage Items' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate/5 bg-white/95 backdrop-blur-md">
      <nav className="container-main flex h-16 items-center justify-between lg:h-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-card bg-primary text-lg font-bold text-white">
            eG
          </span>
          <span className="text-xl font-bold text-slate">
            e<span className="text-primary">Gadjet</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-slate-muted hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated &&
            authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-slate-muted hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          {/* Cart Icon Link */}
          <Link href="/cart" className="relative p-2 text-slate-muted hover:text-primary transition mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-primary rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-muted">Hi, {user?.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary !px-4 !py-2">
                Login
              </Link>
              <Link href="/register" className="btn-primary !px-4 !py-2">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Cart Shortcut */}
          <Link href="/cart" className="relative p-2 text-slate-muted hover:text-primary transition mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-3xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-primary rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-lg p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate/5 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {[...publicLinks, ...(isAuthenticated ? authLinks : [])].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-slate-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-slate/5 pt-3">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-secondary w-full">
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

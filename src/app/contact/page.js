'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <section className="bg-slate py-16 text-white">
        <div className="container-main text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Have questions about an order, product, or our AI assistant? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-main grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">
              Fill out the form and our support team will respond within 24 hours.
            </p>

            <div className="mt-8 space-y-6">
              {[
                { label: 'Address', value: 'House 42, Road 7, Dhanmondi, Dhaka 1205, Bangladesh' },
                { label: 'Email', value: 'support@egadjet.com', href: 'mailto:support@egadjet.com' },
                { label: 'Phone', value: '+880 1712 345 678', href: 'tel:+8801712345678' },
                { label: 'Hours', value: 'Saturday – Thursday, 9:00 AM – 8:00 PM (BST)' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-sm font-semibold text-slate">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-primary hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-muted">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-base space-y-5 p-8">
            <div>
              <label className="label-field">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="input-field"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label-field">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="input-field"
              >
                <option value="">Select a topic</option>
                <option value="order">Order Support</option>
                <option value="product">Product Inquiry</option>
                <option value="ai">AI Assistant Help</option>
                <option value="seller">Seller Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-field">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="input-field"
                placeholder="How can we help you?"
              />
            </div>

            {submitted && (
              <div className="rounded-card bg-green-50 px-4 py-3 text-sm text-green-600">
                Thank you! Your message has been received. We&apos;ll respond within 24 hours.
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

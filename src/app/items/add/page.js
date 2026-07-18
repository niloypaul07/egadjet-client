'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const categories = [
  'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Accessories', 'Smart Home',
];

function AddItemForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    category: 'Smartphones',
    brand: '',
    imageUrl: '',
    stock: '10',
    location: 'Dhaka Warehouse',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        images: data.imageUrl ? [data.imageUrl] : [],
        specifications: {},
      };
      const { data: res } = await api.post('/gadgets', payload);
      return res;
    },
    onSuccess: () => {
      setSuccess('Gadget added successfully!');
      setError('');
      setTimeout(() => router.push('/items/manage'), 1500);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to add gadget');
      setSuccess('');
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      setError('Image URL is required');
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="container-main max-w-2xl py-10">
      <h1 className="section-title">Add New Gadget</h1>
      <p className="section-subtitle">List a new product on the eGadjet marketplace.</p>

      <form onSubmit={handleSubmit} className="card-base mt-8 space-y-5 p-8">
        <div>
          <label className="label-field">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required className="input-field" placeholder="Product title" />
        </div>
        <div>
          <label className="label-field">Short Description *</label>
          <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required maxLength={200} className="input-field" placeholder="Brief summary (max 200 chars)" />
        </div>
        <div>
          <label className="label-field">Full Description *</label>
          <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} required rows={4} className="input-field" placeholder="Detailed product description" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field">Price ($) *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" className="input-field" placeholder="99.99" />
          </div>
          <div>
            <label className="label-field">Stock *</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0" className="input-field" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Brand *</label>
            <input name="brand" value={form.brand} onChange={handleChange} required className="input-field" placeholder="Apple, Samsung, etc." />
          </div>
        </div>
        <div>
          <label className="label-field">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label-field">Image URL *</label>
          <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} required className="input-field" placeholder="https://images.unsplash.com/..." />
        </div>

        {error && <div className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        {success && <div className="rounded-card bg-green-50 px-4 py-3 text-sm text-green-600">{success}</div>}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Adding...' : 'Submit Gadget'}
        </button>
      </form>
    </div>
  );
}

export default function AddItemPage() {
  return (
    <ProtectedRoute>
      <AddItemForm />
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const categories = [
  'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Accessories', 'Smart Home',
];

function EditItemForm() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    category: 'Smartphones',
    brand: '',
    imageUrl: '',
    stock: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isLoading, data: gadgetData } = useQuery({
    queryKey: ['gadget-edit', id],
    queryFn: async () => {
      const { data } = await api.get(`/gadgets/${id}`);
      return data.data.gadget;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (gadgetData) {
      setForm({
        title: gadgetData.title || '',
        shortDescription: gadgetData.shortDescription || '',
        fullDescription: gadgetData.fullDescription || '',
        price: gadgetData.price || '',
        category: gadgetData.category || 'Smartphones',
        brand: gadgetData.brand || '',
        imageUrl: gadgetData.imageUrl || '',
        stock: gadgetData.stock || '',
        location: gadgetData.location || '',
      });
    }
  }, [gadgetData]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        images: data.imageUrl ? [data.imageUrl] : [],
      };
      const { data: res } = await api.put(`/gadgets/${id}`, payload);
      return res;
    },
    onSuccess: () => {
      setSuccess('Gadget updated successfully!');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['my-gadgets'] });
      queryClient.invalidateQueries({ queryKey: ['gadget-edit', id] });
      setTimeout(() => router.push('/items/manage'), 1500);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update gadget');
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

  if (isLoading) {
    return (
      <div className="container-main max-w-2xl py-10">
        <div className="h-8 w-48 skeleton rounded mb-2" />
        <div className="card-base mt-8 space-y-5 p-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 skeleton rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-main max-w-2xl py-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/items/manage')}
          className="text-slate-muted hover:text-slate transition"
          aria-label="Back"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="section-title">Edit Gadget</h1>
          <p className="section-subtitle">Update your listed product details.</p>
        </div>
      </div>

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
          {form.imageUrl && (
            <div className="mt-3 relative h-40 w-full overflow-hidden rounded-lg border border-slate/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>

        {error && <div className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        {success && <div className="rounded-card bg-green-50 px-4 py-3 text-sm text-green-600">{success}</div>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/items/manage')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditItemPage() {
  return (
    <ProtectedRoute>
      <EditItemForm />
    </ProtectedRoute>
  );
}

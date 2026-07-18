'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import GadgetCard, { GadgetCardSkeleton } from '@/components/gadgets/GadgetCard';

export default function GadgetDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (data?.gadget) {
      addToCart(data.gadget, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['gadget', id],
    queryFn: async () => {
      const { data: res } = await api.get(`/gadgets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const { data: res } = await api.post(`/reviews/${id}`, reviewData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gadget', id] });
      setReviewForm({ rating: 5, comment: '' });
      setReviewError('');
    },
    onError: (err) => {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    },
  });

  if (isLoading) {
    return (
      <div className="container-main py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square skeleton rounded-card" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-4 w-1/2 skeleton rounded" />
            <div className="h-20 w-full skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.gadget) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-slate">Gadget Not Found</h1>
        <Link href="/explore" className="btn-primary mt-6 inline-flex">
          Back to Explore
        </Link>
      </div>
    );
  }

  const { gadget, reviews, related } = data;
  const images = gadget.images?.length > 0 ? gadget.images : [gadget.imageUrl];

  const specs = [
    { label: 'Processor', value: gadget.specifications?.processor },
    { label: 'Memory', value: gadget.specifications?.memory },
    { label: 'Storage', value: gadget.specifications?.storage },
    { label: 'Display', value: gadget.specifications?.display },
    { label: 'Battery', value: gadget.specifications?.battery },
    { label: 'Connectivity', value: gadget.specifications?.connectivity },
  ].filter((s) => s.value);

  return (
    <div className="container-main py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-card bg-neutral-100">
            <Image src={images[activeImage]} alt={gadget.title} fill className="object-cover" priority />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">{gadget.brand}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate">{gadget.title}</h1>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(gadget.rating) ? 'fill-accent text-accent' : 'fill-neutral-200 text-neutral-200'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-slate-muted">
                {gadget.rating} ({gadget.reviewCount} reviews)
              </span>
            </div>
            <span className="text-sm text-slate-muted">{gadget.location}</span>
          </div>

          <p className="mt-4 text-4xl font-bold text-primary">${gadget.price}</p>
          <p className="mt-2 text-sm text-slate-muted">
            {gadget.stock > 0 ? `${gadget.stock} in stock` : 'Out of stock'}
          </p>
          <p className="mt-6 text-slate-muted">{gadget.shortDescription}</p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              className={`btn-primary flex-1 transition-all ${added ? '!bg-emerald-600 hover:!bg-emerald-700' : ''}`}
              disabled={gadget.stock === 0}
            >
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
            <Link href="/assistant" className="btn-secondary flex-1 text-center">
              Ask AI
            </Link>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate">Overview</h2>
        <p className="mt-4 leading-relaxed text-slate-muted">{gadget.fullDescription}</p>
      </section>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate">Specifications</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {specs.map((spec) => (
              <div key={spec.label} className="card-base flex justify-between p-4">
                <span className="text-sm font-medium text-slate-muted">{spec.label}</span>
                <span className="text-sm font-semibold text-slate">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate">Customer Reviews</h2>

        {isAuthenticated && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              reviewMutation.mutate(reviewForm);
            }}
            className="card-base mt-6 p-6"
          >
            <h3 className="font-semibold text-slate">Write a Review</h3>
            <div className="mt-4">
              <label className="label-field">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="input-field max-w-xs"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="label-field">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
                rows={3}
                className="input-field"
                placeholder="Share your experience..."
              />
            </div>
            {reviewError && <p className="mt-2 text-sm text-red-500">{reviewError}</p>}
            <button type="submit" disabled={reviewMutation.isPending} className="btn-primary mt-4">
              {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {reviews?.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="card-base p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate">{review.user?.name}</p>
                    <p className="text-xs text-slate-muted">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-accent text-accent" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-muted">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-muted">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </section>

      {/* Related */}
      {related?.length > 0 && (
        <section className="mt-16 pb-10">
          <h2 className="text-2xl font-bold text-slate">Related Gadgets</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((g) => (
              <GadgetCard key={g._id} gadget={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

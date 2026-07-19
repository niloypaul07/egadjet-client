'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/lib/api';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (authLoading || cartLoading) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-lg text-slate-muted">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container-main py-20 text-center max-w-md mx-auto">
        <div className="card-base p-8">
          <h2 className="text-2xl font-bold text-slate mb-4">Login Required</h2>
          <p className="text-slate-muted mb-6">You must be signed in to checkout and place an order.</p>
          <Link href={`/login?redirect=/checkout`} className="btn-primary w-full block text-center">
            Sign In to Continue
          </Link>
          <p className="mt-4 text-sm text-slate-muted">
            Don&apos;t have an account?{' '}
            <Link href={`/register?redirect=/checkout`} className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !success) {
    return (
      <div className="container-main py-20 text-center max-w-md mx-auto">
        <div className="card-base p-8">
          <h2 className="text-2xl font-bold text-slate mb-4">Empty Checkout</h2>
          <p className="text-slate-muted mb-6">Your cart is empty. Add some gadgets first!</p>
          <Link href="/explore" className="btn-primary w-full block text-center">
            Go to Explore
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = cartTotal > 500 ? 0 : 15;
  const tax = cartTotal * 0.05;
  const orderTotal = cartTotal + shippingCost + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          gadget: item.gadget._id,
          quantity: item.quantity,
          price: item.gadget.price,
        })),
        shippingAddress: form,
        paymentMethod,
      };

      const { data } = await api.post('/orders', orderData);
      if (data.success) {
        setPlacedOrder(data.data);
        clearCart();
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while placing your order.');
    } finally {
      setPlacing(false);
    }
  };

  if (success && placedOrder) {
    return (
      <div className="container-main py-20 max-w-2xl mx-auto">
        <div className="card-base p-8 text-center bg-white border border-slate/5">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-emerald-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate mb-2">Order Confirmed!</h2>
          <p className="text-slate-muted mb-6">
            Thank you for your order. Your order ID is <span className="font-semibold text-slate">{placedOrder._id}</span>.
          </p>

          <div className="border-t border-b border-slate/10 py-4 mb-8 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-muted">Shipping To:</span>
              <span className="font-medium text-slate">
                {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-muted">Payment Method:</span>
              <span className="font-medium text-slate">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-muted">Total Paid:</span>
              <span className="font-bold text-primary">${placedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore" className="btn-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="btn-secondary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-10">
      <h1 className="text-3xl font-bold text-slate mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping Form & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="card-base p-6 bg-white border border-slate/5 space-y-5">
            <h2 className="text-xl font-bold text-slate border-b border-slate/5 pb-3">Shipping Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Tech Lane, Banani"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">City</label>
                <input
                  type="text"
                  required
                  placeholder="Dhaka"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Postal Code</label>
                <input
                  type="text"
                  required
                  placeholder="1213"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Country</label>
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate border-b border-slate/5 pb-3 pt-4">Payment Method</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Cash on Delivery', 'Card', 'Mobile Banking'].map((method) => (
                <label
                  key={method}
                  className={`flex flex-col items-center justify-center p-4 border rounded-card cursor-pointer transition ${
                    paymentMethod === method
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-slate/10 text-slate-muted hover:border-slate/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>

            {error && (
              <div className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={placing}
              className="btn-primary w-full !py-3 font-semibold text-base mt-6"
            >
              {placing ? 'Placing Order...' : `Place Order ($${orderTotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="card-base p-6 bg-white border border-slate/5 h-fit space-y-6">
          <h2 className="text-xl font-bold text-slate border-b border-slate/5 pb-3">Your Order</h2>
          <div className="divide-y divide-slate/10 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.gadget._id} className="py-3 flex items-center gap-3">
                <div className="relative h-12 w-12 rounded bg-slate-50 border border-slate/5 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.gadget.imageUrl}
                    alt={item.gadget.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate truncate">{item.gadget.title}</p>
                  <p className="text-xs text-slate-muted">
                    Qty: {item.quantity} × ${item.gadget.price}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate">
                  ${(item.gadget.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-muted">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-muted">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-slate-muted">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate pt-3 border-t border-slate/5">
              <span>Total Amount</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

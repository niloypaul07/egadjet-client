'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/providers/CartProvider';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  if (loading) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-lg text-slate-muted">Loading your cart...</p>
      </div>
    );
  }

  const shippingCost = cartTotal > 500 ? 0 : 15; // Free shipping over $500
  const tax = cartTotal * 0.05; // 5% tax
  const orderTotal = cartTotal + shippingCost + tax;

  return (
    <div className="container-main py-10">
      <h1 className="text-3xl font-bold text-slate mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="card-base py-16 text-center max-w-xl mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-slate-muted mx-auto mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-slate mb-2">Your cart is empty</h2>
          <p className="text-slate-muted mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/explore" className="btn-primary">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.gadget._id}
                className="card-base p-4 flex flex-col sm:flex-row items-center gap-4 border border-slate/5 bg-white"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-card bg-slate-50 border border-slate/5">
                  <Image
                    src={item.gadget.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'}
                    alt={item.gadget.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-slate hover:text-primary transition">
                    <Link href={`/gadgets/${item.gadget._id}`}>{item.gadget.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-muted mt-1">Brand: {item.gadget.brand}</p>
                  <p className="text-sm font-bold text-primary mt-2">${item.gadget.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-slate/10 rounded-card p-1">
                  <button
                    onClick={() => updateQuantity(item.gadget._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8 flex items-center justify-center text-slate-muted hover:text-primary disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-slate">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.gadget._id, item.quantity + 1)}
                    disabled={item.quantity >= item.gadget.stock}
                    className="h-8 w-8 flex items-center justify-center text-slate-muted hover:text-primary disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.gadget._id)}
                  className="p-2 text-slate-muted hover:text-red-600 transition"
                  aria-label="Remove item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Summary Panel */}
          <div className="card-base p-6 border border-slate/5 bg-white h-fit">
            <h2 className="text-xl font-bold text-slate mb-6">Order Summary</h2>
            <div className="space-y-3 pb-6 border-b border-slate/10 text-sm">
              <div className="flex justify-between text-slate-muted">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-muted">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-muted">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate py-6">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full block text-center">
              Proceed to Checkout
            </Link>
            <div className="mt-4 text-center">
              <Link href="/explore" className="text-xs text-primary font-semibold hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

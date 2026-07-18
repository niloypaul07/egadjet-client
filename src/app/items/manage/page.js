'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function ManageItemsContent() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-gadgets'],
    queryFn: async () => {
      const { data: res } = await api.get('/gadgets/my');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/gadgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-gadgets'] });
      setDeleteId(null);
    },
  });

  return (
    <div className="container-main py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="section-title">Manage Items</h1>
          <p className="section-subtitle">View and manage your listed gadgets.</p>
        </div>
        <Link href="/items/add" className="btn-primary">
          Add New Item
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-10 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-base h-20 skeleton" />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <div className="card-base mt-10 p-12 text-center">
          <p className="text-lg font-semibold text-slate">No items listed yet</p>
          <p className="mt-2 text-sm text-slate-muted">Start by adding your first gadget.</p>
          <Link href="/items/add" className="btn-primary mt-6 inline-flex">
            Add Item
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="mt-8 hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate/10 text-left text-sm font-semibold text-slate-muted">
                  <th className="pb-4 pr-4">Product</th>
                  <th className="pb-4 pr-4">Category</th>
                  <th className="pb-4 pr-4">Price</th>
                  <th className="pb-4 pr-4">Stock</th>
                  <th className="pb-4 pr-4">Rating</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item) => (
                  <tr key={item._id} className="border-b border-slate/5">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate">{item.title}</p>
                          <p className="text-xs text-slate-muted">{item.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-muted">{item.category}</td>
                    <td className="py-4 pr-4 text-sm font-semibold text-primary">${item.price}</td>
                    <td className="py-4 pr-4 text-sm text-slate-muted">{item.stock}</td>
                    <td className="py-4 pr-4 text-sm text-slate-muted">{item.rating} ({item.reviewCount})</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Link href={`/items/edit/${item._id}`} className="btn-primary !px-3 !py-1.5 text-xs">
                          Edit
                        </Link>
                        <Link href={`/gadgets/${item._id}`} className="btn-secondary !px-3 !py-1.5 text-xs">
                          View
                        </Link>
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="rounded-card border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mt-8 space-y-4 md:hidden">
            {data?.map((item) => (
              <div key={item._id} className="card-base p-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate">{item.title}</p>
                    <p className="text-xs text-slate-muted">{item.category} · {item.brand}</p>
                    <p className="mt-1 text-lg font-bold text-primary">${item.price}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/items/edit/${item._id}`} className="btn-primary flex-1 text-center !py-2 text-sm">
                    Edit
                  </Link>
                  <Link href={`/gadgets/${item._id}`} className="btn-secondary flex-1 text-center !py-2 text-sm">
                    View
                  </Link>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="flex-1 rounded-card border border-red-200 py-2 text-sm font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card-base max-w-sm p-6">
            <h3 className="text-lg font-semibold text-slate">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-muted">
              Are you sure you want to delete this gadget? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-card bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageItemsPage() {
  return (
    <ProtectedRoute>
      <ManageItemsContent />
    </ProtectedRoute>
  );
}

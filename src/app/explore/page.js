'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import GadgetCard, { GadgetCardSkeleton } from '@/components/gadgets/GadgetCard';

function ExploreContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [brand, setBrand] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(search);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/gadgets/categories');
      return data.data;
    },
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await api.get('/gadgets/brands');
      return data.data;
    },
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['gadgets', search, category, brand, minPrice, maxPrice, minRating, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '12', sort });
      if (search) params.set('search', search);
      if (category !== 'all') params.set('category', category);
      if (brand !== 'all') params.set('brand', brand);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRating) params.set('minRating', minRating);
      const { data: res } = await api.get(`/gadgets?${params}`);
      return res;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setSearchInput('');
    setCategory('all');
    setBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="container-main py-10">
      <div className="mb-8">
        <h1 className="section-title">Explore Gadgets</h1>
        <p className="section-subtitle">Search, filter, and discover premium tech from top brands.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search gadgets by name, brand..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary !px-8">
          Search
        </button>
      </form>

      <div className="mb-8 grid gap-4 rounded-card border border-slate/5 bg-white p-6 sm:grid-cols-2 lg:grid-cols-6">
        <div>
          <label className="label-field">Category</label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input-field">
            <option value="all">All Categories</option>
            {categoriesData?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Brand</label>
          <select value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }} className="input-field">
            <option value="all">All Brands</option>
            {brandsData?.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Min Price</label>
          <input type="number" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} placeholder="$0" className="input-field" />
        </div>
        <div>
          <label className="label-field">Max Price</label>
          <input type="number" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} placeholder="$5000" className="input-field" />
        </div>
        <div>
          <label className="label-field">Min Rating</label>
          <select value={minRating} onChange={(e) => { setMinRating(e.target.value); setPage(1); }} className="input-field">
            <option value="">Any</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>
        <div>
          <label className="label-field">Sort By</label>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="input-field">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-muted">
          {data?.pagination?.total || 0} gadgets found
          {isFetching && !isLoading && ' (updating...)'}
        </p>
        <button onClick={resetFilters} className="text-sm font-medium text-primary hover:underline">
          Reset Filters
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <GadgetCardSkeleton key={i} />)
          : data?.data?.length > 0
            ? data.data.map((g) => <GadgetCard key={g._id} gadget={g} />)
            : (
              <div className="col-span-full py-20 text-center">
                <p className="text-lg font-semibold text-slate">No gadgets found</p>
                <p className="mt-2 text-sm text-slate-muted">Try adjusting your filters or search terms.</p>
              </div>
            )}
      </div>

      {data?.pagination?.pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary !px-4 !py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 text-sm text-slate-muted">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
            disabled={page === data.pagination.pages}
            className="btn-secondary !px-4 !py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="container-main py-20 text-center">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}

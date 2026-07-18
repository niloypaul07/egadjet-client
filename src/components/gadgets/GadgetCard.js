import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function GadgetCard({ gadget }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="card-base group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-slate-muted">
            <svg className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <Image
            src={gadget.imageUrl}
            alt={gadget.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-slate">
          {gadget.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-muted">{gadget.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate">{gadget.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-muted">{gadget.shortDescription}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-lg font-bold text-primary">${gadget.price}</span>
          <div className="flex items-center gap-1 text-slate-muted">
            <svg className="h-4 w-4 fill-accent text-accent" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{gadget.rating}</span>
            <span className="text-xs">({gadget.reviewCount})</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-slate-muted">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {gadget.location}
        </div>

        <Link
          href={`/gadgets/${gadget._id}`}
          className="btn-primary mt-4 w-full !py-2.5 text-center text-sm"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export function GadgetCardSkeleton() {
  return (
    <div className="card-base overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-5 w-full skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-16 skeleton rounded" />
          <div className="h-4 w-12 skeleton rounded" />
        </div>
        <div className="h-10 w-full skeleton rounded-card" />
      </div>
    </div>
  );
}

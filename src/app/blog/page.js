import Link from 'next/link';
import Image from 'next/image';

const posts = [
  {
    slug: 'ai-shopping-future',
    title: 'How AI is Transforming Gadget Shopping in 2025',
    excerpt:
      'Discover how conversational AI agents are replacing traditional search filters and helping consumers make smarter tech purchases.',
    date: 'March 15, 2025',
    author: 'Nusrat Jahan',
    category: 'AI & Tech',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
  {
    slug: 'iphone-15-pro-review',
    title: 'iPhone 15 Pro Max: Six Months Later Review',
    excerpt:
      'Our comprehensive long-term review covering camera performance, battery life, and whether the titanium upgrade is worth it.',
    date: 'February 28, 2025',
    author: 'Arif Hassan',
    category: 'Reviews',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  },
  {
    slug: 'gaming-setup-guide',
    title: 'Building the Ultimate Gaming Setup Under $2500',
    excerpt:
      'A step-by-step guide to assembling a competitive gaming rig with console, peripherals, and display recommendations.',
    date: 'February 10, 2025',
    author: 'Imran Chowdhury',
    category: 'Guides',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80',
  },
  {
    slug: 'noise-canceling-comparison',
    title: 'Sony WH-1000XM5 vs Apple AirPods Max: Which Wins?',
    excerpt:
      'We put the two flagship noise-canceling headphones through rigorous testing for sound quality, comfort, and battery life.',
    date: 'January 22, 2025',
    author: 'Farhana Akter',
    category: 'Comparisons',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    slug: 'smart-home-starter',
    title: 'Smart Home Starter Kit: 5 Gadgets to Begin With',
    excerpt:
      'New to smart home technology? Start with these five essential devices that deliver the most value for your investment.',
    date: 'January 5, 2025',
    author: 'Nusrat Jahan',
    category: 'Guides',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1512446816042-444d641267d4?w=800&q=80',
  },
  {
    slug: 'macbook-buying-guide',
    title: 'MacBook Buying Guide: M3 vs M3 Pro vs M3 Max',
    excerpt:
      'Confused about which MacBook to buy? We break down the performance differences and help you pick the right chip for your workflow.',
    date: 'December 18, 2024',
    author: 'Arif Hassan',
    category: 'Guides',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  },
];

export default function BlogPage() {
  return (
    <div>
      <section className="bg-slate py-16 text-white">
        <div className="container-main text-center">
          <h1 className="text-4xl font-bold">eGadjet Blog</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Expert reviews, buying guides, and tech insights to help you make informed decisions.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-main">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="card-base group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-slate">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-muted">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-slate line-clamp-2">{post.title}</h2>
                  <p className="mt-2 text-sm text-slate-muted line-clamp-3">{post.excerpt}</p>
                  <p className="mt-4 text-xs font-medium text-primary">By {post.author}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

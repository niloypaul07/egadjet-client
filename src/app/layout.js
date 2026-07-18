import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/providers/Providers';
import './globals.css';

export const metadata = {
  title: 'eGadjet | AI-Powered Gadget Marketplace',
  description:
    'Discover premium gadgets with intelligent AI recommendations. Shop smartphones, laptops, gaming gear, and more at eGadjet Bangladesh.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

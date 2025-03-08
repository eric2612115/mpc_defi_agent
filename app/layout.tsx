// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import ThemeWrapper from './ThemeWrapper';

// Define fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const sourceSans = Source_Sans_3({ 
  subsets: ['latin'],
  variable: '--font-source-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
});

// Metadata for SEO
export const metadata: Metadata = {
  title: 'AI Trading Assistant',
  description: 'Secure crypto trading platform with AI assistance, multi-signature wallet support, and market analysis',
  keywords: 'AI, trading, cryptocurrency, multi-signature wallet, secure trading',
  authors: [{ name: 'AI Trading Assistant Team' }],
};

// 添加独立的 viewport 配置
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${sourceSans.variable}`} lang="en">
      <body>
        <Providers>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </Providers>
      </body>
    </html>
  );
}
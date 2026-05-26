import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'otoAgora — 思想・議論ベースSNS',
  description: '人ではなく思想・主張に同意・フォローするSNS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100 antialiased">
        <NavBar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

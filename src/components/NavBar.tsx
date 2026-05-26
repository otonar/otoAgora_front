'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';

export default function NavBar() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const logout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-violet-400 tracking-widest">
          otoAgora
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            議題
          </Link>
          <Link href="/perspectives" className="text-gray-400 hover:text-white transition-colors">
            思想
          </Link>
          {hydrated && user && (
            <Link href="/feed" className="text-gray-400 hover:text-white transition-colors">
              フィード
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {hydrated && user ? (
            <>
              <span className="text-gray-500">{user.username}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                登録
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

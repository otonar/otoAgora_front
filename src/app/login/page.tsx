'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api.auth.login({ email, password });
      setAuth(token, user);
      router.push('/');
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-8">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold text-white">ログイン</h1>
        <p className="text-gray-500 text-sm">Agoraへようこそ</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm">
        アカウントをお持ちでない方は{' '}
        <Link href="/register" className="text-violet-400 hover:underline">新規登録</Link>
      </p>
    </div>
  );
}

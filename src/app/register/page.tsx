'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api.auth.register({ username, email, password });
      setAuth(token, user);
      router.push('/perspectives');
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-8">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold text-white">新規登録</h1>
        <p className="text-gray-500 text-sm">思想をフォローして議論に参加する</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">ユーザー名</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required minLength={3} maxLength={32}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
        </div>
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
          <label className="text-sm text-gray-400">パスワード（8文字以上）</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required minLength={8}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm">
        すでにアカウントをお持ちの方は{' '}
        <Link href="/login" className="text-violet-400 hover:underline">ログイン</Link>
      </p>
    </div>
  );
}

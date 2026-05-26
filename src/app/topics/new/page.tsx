'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function NewTopicPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-gray-400">議題を作成するにはログインが必要です</p>
        <a href="/login" className="text-violet-400 hover:underline">ログインする</a>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const topic = await api.topics.create({ title, description }, token);
      router.push(`/topics/${topic.id}`);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-white">議題を作成</h1>
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">議題タイトル</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required minLength={5} maxLength={100}
            placeholder="例: AIは人間の仕事を奪うか"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">説明</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required minLength={10} maxLength={500}
            rows={4}
            placeholder="この議題について詳しく説明してください"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
        >
          {loading ? '作成中...' : '作成する'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Thesis, Perspective } from '@/types';

interface Props {
  topicId: string;
  perspectives: Perspective[];
  onAdded: (thesis: Thesis) => void;
}

export default function NewThesisForm({ topicId, perspectives, onAdded }: Props) {
  const { token } = useAuthStore();
  const [content, setContent] = useState('');
  const [perspectiveId, setPerspectiveId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length < 20) { setError('20文字以上で入力してください'); return; }
    setLoading(true);
    setError('');
    try {
      const thesis = await api.theses.create(
        { topicId, content, ...(perspectiveId ? { perspectiveId } : {}) },
        token,
      );
      onAdded(thesis);
      setContent('');
      setPerspectiveId('');
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <h3 className="text-white font-medium">主張を投稿する</h3>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="あなたの主張を書いてください（20文字以上）"
        rows={4}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none text-sm"
      />
      <select
        value={perspectiveId}
        onChange={e => setPerspectiveId(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 focus:outline-none focus:border-violet-500 text-sm"
      >
        <option value="">思想・立場を選択（任意）</option>
        {perspectives.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-sm transition-colors disabled:opacity-50"
      >
        {loading ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function NewPerspectiveFormClient() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.perspectives.create({ name, description }, token);
      setName('');
      setDescription('');
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-gray-900 border border-gray-800 border-dashed hover:border-violet-600 rounded-xl p-4 text-gray-500 hover:text-violet-400 transition-colors text-sm"
      >
        + 思想・立場を追加する
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="bg-gray-900 border border-violet-800 rounded-xl p-5 space-y-3">
      <h3 className="text-white font-medium">思想・立場を追加する</h3>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        required minLength={2} maxLength={50}
        placeholder="例: 功利主義、リベラリズム、技術加速主義"
        autoFocus
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 text-sm"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        required minLength={10} maxLength={500}
        placeholder="この思想・立場についての説明"
        rows={3}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none text-sm"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-sm transition-colors disabled:opacity-50"
        >
          {loading ? '作成中...' : '作成する'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 px-4 py-2 text-sm">
          キャンセル
        </button>
      </div>
    </form>
  );
}

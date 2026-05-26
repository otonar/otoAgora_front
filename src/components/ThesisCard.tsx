'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Thesis } from '@/types';

interface Props {
  thesis: Thesis;
  perspectiveName?: string | null;
}

export default function ThesisCard({ thesis, perspectiveName }: Props) {
  const { token } = useAuthStore();
  const [count, setCount] = useState(thesis.endorseCount ?? 0);
  const [endorsed, setEndorsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!token || loading) return;
    setLoading(true);
    try {
      if (endorsed) {
        await api.theses.unendorse(thesis.id, token);
        setCount(c => c - 1);
      } else {
        await api.theses.endorse(thesis.id, token);
        setCount(c => c + 1);
      }
      setEndorsed(e => !e);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      {perspectiveName && (
        <span className="text-xs text-violet-400 bg-violet-950 border border-violet-800 px-2 py-0.5 rounded-full">
          {perspectiveName}
        </span>
      )}
      <p className="text-gray-100 leading-relaxed">{thesis.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {new Date(thesis.createdAt).toLocaleDateString('ja-JP')}
        </span>
        <button
          onClick={toggle}
          disabled={!token || loading}
          className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border transition-colors ${
            endorsed
              ? 'border-violet-500 text-violet-400 bg-violet-950'
              : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
          } disabled:opacity-40`}
        >
          <span>同意</span>
          <span>{count}</span>
        </button>
      </div>
    </div>
  );
}

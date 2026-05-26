'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Perspective } from '@/types';

interface Props {
  perspective: Perspective;
}

export default function PerspectiveCard({ perspective }: Props) {
  const { token } = useAuthStore();
  const [followers, setFollowers] = useState(perspective.followerCount ?? 0);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!token || loading) return;
    setLoading(true);
    try {
      if (following) {
        await api.perspectives.unfollow(perspective.id, token);
        setFollowers(f => f - 1);
      } else {
        await api.perspectives.follow(perspective.id, token);
        setFollowers(f => f + 1);
      }
      setFollowing(f => !f);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-white font-semibold text-lg">{perspective.name}</h3>
        <button
          onClick={toggle}
          disabled={!token || loading}
          className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors ${
            following
              ? 'border-violet-500 text-violet-400 bg-violet-950'
              : 'border-gray-700 text-gray-400 hover:border-violet-600 hover:text-violet-400'
          } disabled:opacity-40`}
        >
          {following ? 'フォロー中' : 'フォロー'}
        </button>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{perspective.description}</p>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>フォロワー {followers}</span>
        <span>主張 {perspective.thesesCount ?? 0}</span>
      </div>
    </div>
  );
}

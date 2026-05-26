'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { FeedItem } from '@/types';

export default function FeedPage() {
  const { token } = useAuthStore();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.feed.get(token)
      .then(d => setFeed(d.feed))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-gray-400">フィードを見るにはログインが必要です</p>
        <Link href="/login" className="text-violet-400 hover:underline">ログインする</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">フィード</h1>
        <p className="text-gray-500 text-sm">フォロー中の思想に紐づいた主張</p>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center py-16">読み込み中...</p>
      ) : feed.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-gray-500">フィードが空です</p>
          <p className="text-gray-600 text-sm">
            <Link href="/perspectives" className="text-violet-400 hover:underline">思想をフォロー</Link>
            すると、その思想に紐づいた主張が流れます
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map(item => (
            <Link key={item.id} href={`/topics/${item.topicId}`}>
              <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 space-y-3 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{item.topicTitle}</span>
                  {item.perspectiveName && (
                    <span className="text-xs text-violet-400 bg-violet-950 border border-violet-800 px-2 py-0.5 rounded-full">
                      {item.perspectiveName}
                    </span>
                  )}
                </div>
                <p className="text-gray-100 leading-relaxed">{item.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="text-xs text-gray-600">同意 {item.endorseCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

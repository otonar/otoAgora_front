import Link from 'next/link';
import { api } from '@/lib/api';
import type { Topic } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let topics: Topic[] = [];
  try {
    const data = await api.topics.list();
    topics = data.topics;
  } catch {}

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">議題</h1>
          <p className="text-gray-500 text-sm">思想・立場をフォローして、あなたのフィードを作る</p>
        </div>
        <Link
          href="/topics/new"
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-sm transition-colors"
        >
          + 議題を作成
        </Link>
      </div>

      {topics.length === 0 ? (
        <p className="text-gray-600 text-center py-16">まだ議題がありません</p>
      ) : (
        <div className="grid gap-4">
          {topics.map(topic => (
            <Link key={topic.id} href={`/topics/${topic.id}`}>
              <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h2 className="text-white font-semibold text-lg group-hover:text-violet-300 transition-colors">
                      {topic.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2">{topic.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-600 bg-gray-800 px-2.5 py-1 rounded-full">
                    {topic.thesesCount ?? 0} 主張
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-3">
                  {new Date(topic.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

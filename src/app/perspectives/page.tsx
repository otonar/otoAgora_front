import { api } from '@/lib/api';
import PerspectiveCard from '@/components/PerspectiveCard';
import NewPerspectiveFormClient from '@/components/NewPerspectiveFormClient';

export const dynamic = 'force-dynamic';

export default async function PerspectivesPage() {
  let perspectives: import('@/types').Perspective[] = [];
  try {
    const data = await api.perspectives.list();
    perspectives = data.perspectives;
  } catch {}

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">思想・立場</h1>
          <p className="text-gray-500 text-sm">
            人ではなく思想をフォローする — フォローした思想の主張がフィードに流れる
          </p>
        </div>
      </div>

      <NewPerspectiveFormClient />

      {perspectives.length === 0 ? (
        <p className="text-gray-600 text-center py-16">まだ思想・立場がありません</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {perspectives.map((p) => (
            <PerspectiveCard key={p.id} perspective={p} />
          ))}
        </div>
      )}
    </div>
  );
}

import { api } from '@/lib/api';
import ThesisCard from '@/components/ThesisCard';
import NewThesisForm from '@/components/NewThesisFormClient';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TopicPage({ params }: Props) {
  const { id } = await params;

  let topic, thesesData, perspectivesData;
  try {
    [topic, thesesData, perspectivesData] = await Promise.all([
      api.topics.get(id),
      api.theses.list(id),
      api.perspectives.list(),
    ]);
  } catch {
    notFound();
  }

  const theses = thesesData!.theses;
  const perspectives = perspectivesData!.perspectives;

  const perspMap = Object.fromEntries(perspectives.map(p => [p.id, p.name]));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{topic!.title}</h1>
        <p className="text-gray-400">{topic!.description}</p>
      </div>

      <NewThesisForm topicId={id} perspectives={perspectives} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">
          主張 <span className="text-gray-600 font-normal text-base">({theses.length})</span>
        </h2>
        {theses.length === 0 ? (
          <p className="text-gray-600 py-8 text-center">まだ主張がありません。最初の主張を投稿してください。</p>
        ) : (
          <div className="space-y-4">
            {theses.map(thesis => (
              <ThesisCard
                key={thesis.id}
                thesis={thesis}
                perspectiveName={thesis.perspectiveId ? perspMap[thesis.perspectiveId] : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

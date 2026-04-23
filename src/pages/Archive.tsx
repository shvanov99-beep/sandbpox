import { useLiveQuery } from 'dexie-react-hooks';
import { listDecisions } from '../db/decisions';

export default function Archive() {
  const decisions = useLiveQuery(() => listDecisions(), [], []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight mb-8">Архив</h1>
      {decisions && decisions.length === 0 ? (
        <p className="text-sm text-ink-500">Пока пусто.</p>
      ) : (
        <ul className="divide-y divide-ink-200 dark:divide-ink-800">
          {decisions?.map((d) => (
            <li key={d.id} className="py-4 flex items-baseline gap-4">
              <time className="text-xs text-ink-400 tabular-nums shrink-0 w-24">
                {new Date(d.created_at).toLocaleDateString()}
              </time>
              <div className="flex-1 min-w-0">
                <p className="truncate">{d.action}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  уверенность {d.confidence}/10 · {d.emotional_state}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

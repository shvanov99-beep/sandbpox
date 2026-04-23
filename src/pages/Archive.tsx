import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { listDecisions, deleteDecision } from '../db/decisions';

export default function Archive() {
  const decisions = useLiveQuery(() => listDecisions(), [], []);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function onConfirm(id: string) {
    setBusyId(id);
    try {
      await deleteDecision(id);
      setPendingId(null);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight mb-8">Архив</h1>
      {decisions && decisions.length === 0 ? (
        <p className="text-sm text-ink-500">Пока пусто.</p>
      ) : (
        <ul className="divide-y divide-ink-200 dark:divide-ink-800">
          {decisions?.map((d) => {
            const pending = pendingId === d.id;
            const busy = busyId === d.id;
            return (
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
                <div className="shrink-0 text-xs flex items-center gap-3">
                  {pending ? (
                    <>
                      <span className="text-ink-500">удалить вместе с ревью?</span>
                      <button
                        type="button"
                        onClick={() => onConfirm(d.id)}
                        disabled={busy}
                        className="text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        {busy ? '…' : 'да'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingId(null)}
                        disabled={busy}
                        className="text-ink-400 hover:text-ink-900 dark:hover:text-ink-100"
                      >
                        нет
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingId(d.id)}
                      aria-label="Удалить решение"
                      className="w-6 h-6 flex items-center justify-center
                                 text-ink-300 dark:text-ink-600
                                 hover:text-red-500 dark:hover:text-red-400
                                 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

import { db } from './index';
import type { Decision } from './types';
import { uuid } from '../lib/uuid';

export type DecisionDraft = Omit<Decision, 'id' | 'created_at'> & {
  tags: string[];   // raw tag names, user-typed
};

/**
 * Creates a decision and its tag associations in a single transaction.
 * Tags are upserted case-insensitively by name.
 *
 * Append-only invariant: there is intentionally NO `updateDecision`.
 * Past selves don't get rewritten — corrections live in Reviews as ad_hoc.
 */
export async function createDecision(draft: DecisionDraft): Promise<Decision> {
  const now = Date.now();

  const decision: Decision = {
    id: uuid(),
    action:          draft.action.trim(),
    context:         draft.context.trim(),
    alternatives:    draft.alternatives.trim(),
    main_argument:   draft.main_argument.trim(),
    expect_3m:       draft.expect_3m.trim(),
    expect_6m:       draft.expect_6m.trim(),
    expect_12m:      draft.expect_12m.trim(),
    confidence:      draft.confidence,
    emotional_state: draft.emotional_state.trim(),
    created_at:      now,
  };

  const cleanTags = Array.from(
    new Set(draft.tags.map((t) => t.trim()).filter(Boolean)),
  );

  await db.transaction('rw', db.decisions, db.tags, db.decision_tags, async () => {
    await db.decisions.add(decision);

    for (const name of cleanTags) {
      const existing = await db.tags
        .where('name')
        .equalsIgnoreCase(name)
        .first();

      const tagId = existing?.id ?? uuid();
      if (!existing) {
        await db.tags.add({ id: tagId, name, created_at: now });
      }
      await db.decision_tags.put({ decision_id: decision.id, tag_id: tagId });
    }
  });

  return decision;
}

export async function getDecision(id: string): Promise<Decision | undefined> {
  return db.decisions.get(id);
}

export async function listDecisions(): Promise<Decision[]> {
  return db.decisions.orderBy('created_at').reverse().toArray();
}

export async function getTagsForDecision(decisionId: string): Promise<string[]> {
  const links = await db.decision_tags
    .where('decision_id')
    .equals(decisionId)
    .toArray();
  const tags = await db.tags.bulkGet(links.map((l) => l.tag_id));
  return tags.filter(Boolean).map((t) => t!.name);
}

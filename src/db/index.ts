import Dexie, { type Table } from 'dexie';
import type { Decision, Review, Tag, DecisionTag } from './types';

class JournalDB extends Dexie {
  decisions!: Table<Decision, string>;
  reviews!: Table<Review, string>;
  tags!: Table<Tag, string>;
  decision_tags!: Table<DecisionTag, [string, string]>;

  constructor() {
    super('decision-journal');

    this.version(1).stores({
      decisions:     'id, created_at, confidence, emotional_state',
      reviews:       'id, decision_id, review_date, trigger_type, actual_outcome_score',
      tags:          'id, &name',
      decision_tags: '[decision_id+tag_id], decision_id, tag_id',
    });
  }
}

export const db = new JournalDB();

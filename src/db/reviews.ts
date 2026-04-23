import { db } from './index';
import type { Review, TriggerType } from './types';
import { uuid } from '../lib/uuid';

export type ReviewDraft = Omit<Review, 'id' | 'created_at'>;

/**
 * Appends a review layer. Reviews are never mutated — to correct a past review,
 * add another one with trigger_type='ad_hoc'.
 */
export async function appendReview(draft: ReviewDraft): Promise<Review> {
  const review: Review = {
    ...draft,
    id: uuid(),
    created_at: Date.now(),
  };
  await db.reviews.add(review);
  return review;
}

export async function listReviewsFor(decisionId: string): Promise<Review[]> {
  return db.reviews
    .where('decision_id')
    .equals(decisionId)
    .sortBy('review_date');
}

export async function hasReviewOfType(
  decisionId: string,
  trigger: TriggerType,
): Promise<boolean> {
  const count = await db.reviews
    .where({ decision_id: decisionId, trigger_type: trigger })
    .count();
  return count > 0;
}

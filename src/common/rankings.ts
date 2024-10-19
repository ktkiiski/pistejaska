import { sortBy } from "lodash-es";

interface ScoredObject {
  score: number;
  tieBreaker?: number;
}

interface RankedObject {
  index: number;
  position: number;
  normalizedScore: number | null;
  normalizedIndex: number | null;
  normalizedPosition: number | null;
}

/**
 * Takes an array of objects with `score` and optionally `tieBreaker` properties,
 * sorts them in the "winning" order, and then returns an array of sorted objects
 * where each object is extended with more properties:
 * - `index`: the 0 based original index of the object
 * - `position`: the 1 based ranking position of the object (there may be duplicates on ties)
 * - `normalizedScore`: score normalized between 0...1
 * - `normalizedIndex`: original index normalized between 0...1
 * - `normalizedPosition`: ranked position normalized between 0...1
 */
export function rankScores<T extends ScoredObject>(
  values: T[],
): (T & RankedObject)[] {
  const { length } = values;
  if (!length) {
    return [];
  }
  const indexed = values.map((obj, index) => ({
    ...obj,
    index,
    normalizedIndex: length > 1 ? index / (length - 1) : null,
  }));
  const scored = sortBy(
    indexed,
    // Primarily sort by score
    (obj) => -obj.score,
    // Secondarily sort by tie-breaker
    (obj) => -(obj.tieBreaker ?? 0),
  );
  const maxScore = scored[0].score;
  const minScore = scored[length - 1].score;
  const scoreDiff = maxScore - minScore;
  // Determine positions for each place, giving equal positions to equal scores.
  let latestPosition = 0;
  let latestScore = NaN;
  let latestTieBreaker = NaN;
  const rankings = scored.map((ranking, index) => {
    const { score, tieBreaker = 0 } = ranking;
    let position;
    if (score === latestScore && tieBreaker === latestTieBreaker) {
      // Tied with the previous place(s)
      position = latestPosition;
    } else {
      position = index + 1;
      latestScore = score;
      latestPosition = position;
      latestTieBreaker = tieBreaker;
    }
    return { ...ranking, position };
  });
  // Finally, calculate normalized positions for each place
  return rankings.map((ranking) => ({
    ...ranking,
    // Normalize position between 0...1, unless everyone are tied
    normalizedPosition:
      latestPosition < 2 ? null : (ranking.position - 1) / (latestPosition - 1),
    // Normalize score between 0...1, unless everyone are tied
    normalizedScore:
      scoreDiff > 0 ? (ranking.score - minScore) / scoreDiff : null,
  }));
}

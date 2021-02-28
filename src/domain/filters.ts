import { union } from "lodash";
import { Play } from "./play";

export interface ReportFilters {
  playerCount: null | number;
  expansions: string[];
}

export const emptyFilters: ReportFilters = {
  playerCount: null,
  expansions: [],
};

export function addExpansionFilter(filters: ReportFilters, expansionId: string): ReportFilters {
  const newExpansions = union(filters.expansions, [expansionId]);
  return { ...filters, expansions: newExpansions };
}

export function removeExpansionFilter(filters: ReportFilters, expansionId: string): ReportFilters {
  const newExpansions = filters.expansions.filter(expId => expId !== expansionId);
  return { ...filters, expansions: newExpansions };
}

export function toggleExpansionFilter(filters: ReportFilters, expansionId: string): ReportFilters {
  return filters.expansions.includes(expansionId) ? removeExpansionFilter(filters, expansionId) : addExpansionFilter(filters, expansionId);
}

export function hasFilters(filters: ReportFilters): boolean {
  return filters.playerCount != null || filters.expansions.length > 0;
}

export function applyPlayFilters(allPlays: Play[], filters: ReportFilters) {
  const { expansions, playerCount } = filters;
  // Filter by expansions
  let plays = expansions.reduce(
    (plays, expansionId) => plays.filter(
      play => play.expansions.includes(expansionId)
    ),
    allPlays,
  );
  // Filter by player count
  if (playerCount != null) {
    plays = plays.filter(play => play.players.length === playerCount);
  }
  return plays;
}

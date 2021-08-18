import { union } from "lodash";
import { Play } from "./play";

export interface ReportFilters {
  playerCount: null | number;
  expansions: string[];
  fieldValues: { [fieldId: string]: string[] };
}

export const emptyFilters: ReportFilters = {
  playerCount: null,
  expansions: [],
  fieldValues: {},
};

export function addExpansionFilter(
  filters: ReportFilters,
  expansionId: string
): ReportFilters {
  const newExpansions = union(filters.expansions, [expansionId]);
  return { ...filters, expansions: newExpansions };
}

export function removeExpansionFilter(
  filters: ReportFilters,
  expansionId: string
): ReportFilters {
  const newExpansions = filters.expansions.filter(
    (expId) => expId !== expansionId
  );
  return { ...filters, expansions: newExpansions };
}

export function toggleExpansionFilter(
  filters: ReportFilters,
  expansionId: string
): ReportFilters {
  return filters.expansions.includes(expansionId)
    ? removeExpansionFilter(filters, expansionId)
    : addExpansionFilter(filters, expansionId);
}

export function setFieldValueFilter(
  filters: ReportFilters,
  fieldId: string,
  values: string[]
) {
  const newFieldValues = { ...filters.fieldValues };
  if (values.length) {
    newFieldValues[fieldId] = values;
  } else {
    delete newFieldValues[fieldId];
  }
  return { ...filters, fieldValues: newFieldValues };
}

export function addFieldValueFilter(
  filters: ReportFilters,
  fieldId: string,
  value: string
): ReportFilters {
  const newValues = union(filters.fieldValues[fieldId], [value]);
  return setFieldValueFilter(filters, fieldId, newValues);
}

export function removeFieldValueFilter(
  filters: ReportFilters,
  fieldId: string,
  value: string
): ReportFilters {
  const newValues = filters.fieldValues[fieldId]?.filter(
    (val) => val !== value
  );
  return setFieldValueFilter(filters, fieldId, newValues ?? []);
}

export function toggleFieldValueFilter(
  filters: ReportFilters,
  fieldId: string,
  value: string
): ReportFilters {
  return filters.fieldValues[fieldId]?.includes(fieldId)
    ? removeFieldValueFilter(filters, fieldId, value)
    : addFieldValueFilter(filters, fieldId, value);
}

export function hasFilters(filters: ReportFilters): boolean {
  const { playerCount, expansions, fieldValues } = filters;
  return (
    playerCount != null ||
    expansions.length > 0 ||
    Object.keys(fieldValues).some((fieldId) => fieldValues[fieldId]?.length > 0)
  );
}

export function applyPlayFilters(allPlays: Play[], filters: ReportFilters) {
  const { expansions, playerCount, fieldValues } = filters;
  // Filter by expansions
  let filteredPlays = expansions.reduce(
    (plays, expansionId) =>
      plays.filter((play) => play.expansions.includes(expansionId)),
    allPlays
  );
  // Filter by player count
  if (playerCount != null) {
    filteredPlays = filteredPlays.filter(
      (play) => play.players.length === playerCount
    );
  }
  // Filter by dimension values
  filteredPlays = Object.keys(fieldValues).reduce((plays, fieldId) => {
    const values = fieldValues[fieldId];
    return plays.filter((play) =>
      values.every((value) => play.hasMiscFieldValue(fieldId, value))
    );
  }, filteredPlays);
  return filteredPlays;
}

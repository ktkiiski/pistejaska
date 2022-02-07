import React from "react";
import {
  applyPlayFilters,
  emptyFilters,
  hasFilters,
  ReportFilters,
  setFieldValueFilter,
  toggleExpansionFilter,
  toggleFieldValueFilter,
} from "./domain/filters";
import { Play } from "./domain/play";
import { sortBy, union } from "lodash";
import { Game } from "./domain/game";
import MultiSelectField from "./common/components/inputs/MultiSelectField";
import { pluralize } from "./common/stringUtils";
import ButtonDanger from "./common/components/buttons/ButtonDanger";
import SelectField from "./common/components/inputs/SelectField";

interface ReportFilterSelectorProps {
  game: Game;
  filters: ReportFilters;
  plays: Play[];
  onChange: (filters: ReportFilters) => void;
}

function renderPlayerCount(playerCount: number | "" | null): React.ReactNode {
  if (typeof playerCount !== "number") {
    return <em>Any number</em>;
  }
  return playerCount === 1 ? "1 player" : `${playerCount} players`;
}

interface ExpansionOption {
  name: string;
  id: string | null;
}

const noExpansionsOption: ExpansionOption = {
  name: "No expansions",
  id: null,
};

function ReportFilterSelector({
  game,
  plays,
  filters,
  onChange,
}: ReportFilterSelectorProps) {
  const playerCounts = sortBy(union(plays.map((play) => play.rankings.length)));
  const { expansions = [] } = game;
  // Add "No expansions" filter category
  const expansionOptions: ExpansionOption[] = [
    noExpansionsOption,
    ...expansions,
  ];

  const isFiltering = hasFilters(filters);
  // TODO: support expansion misc fields
  const reportFields = game
    .getRelevantReportFields()
    // TODO: Support fields without pre-defined options
    .filter((field) => field.options?.length);
  return (
    <div className="mb-4 flex flex-row items-center justify-start flex-wrap text-left gap-3">
      {!expansions.length ? null : (
        <MultiSelectField
          label="Expansions"
          values={filters.expansions}
          onChange={(newExpansions) => {
            onChange({ ...filters, expansions: newExpansions });
          }}
          options={expansionOptions.map((expansion) => {
            const nestedFilters = toggleExpansionFilter(filters, expansion.id);
            const isSelected = filters.expansions.includes(expansion.id);
            const nestedPlays = applyPlayFilters(
              plays,
              isSelected ? filters : nestedFilters
            );
            return {
              label: expansion.name,
              description: pluralize(nestedPlays.length, "play", "plays"),
              value: expansion.id,
              disabled: !isSelected && !nestedPlays.length,
            };
          })}
        />
      )}
      {reportFields.map((field) => (
        <MultiSelectField
          key={field.id}
          label={field.name}
          values={filters.fieldValues[field.id] ?? []}
          onChange={(newValues) => {
            onChange(setFieldValueFilter(filters, field.id, newValues));
          }}
          options={
            field.options?.map((option) => {
              const nestedFilters = toggleFieldValueFilter(
                filters,
                field.id,
                option.value
              );
              const nestedPlays = applyPlayFilters(plays, nestedFilters);
              const isSelected = !!filters.fieldValues[field.id]?.includes(
                option.value
              );
              return {
                label: option.label,
                description: pluralize(nestedPlays.length, "play", "plays"),
                value: option.value,
                disabled: !isSelected && !nestedPlays.length,
              };
            }) ?? []
          }
        />
      ))}
      <SelectField
        label="Player count"
        value={filters.playerCount}
        onChange={(newPlayerCount) => {
          onChange({ ...filters, playerCount: newPlayerCount });
        }}
        options={[null, ...playerCounts].map((playerCount) => {
          const nestedFilters: ReportFilters = { ...filters, playerCount };
          const nestedPlays = applyPlayFilters(plays, nestedFilters);
          const isSelected = playerCount === filters.playerCount;
          return {
            value: playerCount,
            disabled: !isSelected && !nestedPlays.length,
            label: renderPlayerCount(playerCount),
            description: pluralize(nestedPlays.length, "play", "plays"),
            hideSelectedLabel: playerCount == null,
          };
        })}
      />
      <ButtonDanger
        className="mt-3"
        disabled={!isFiltering}
        onClick={() => onChange(emptyFilters)}
      >
        Clear filters
      </ButtonDanger>
    </div>
  );
}

export default ReportFilterSelector;

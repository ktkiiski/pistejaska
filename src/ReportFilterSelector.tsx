import React, { useState } from "react";
import { Button, Chip, FormControl, Input, InputLabel, ListItemText, makeStyles, MenuItem, Select, useTheme } from "@material-ui/core";
import { applyPlayFilters, emptyFilters, hasFilters, ReportFilters, setFieldValueFilter, toggleExpansionFilter, toggleFieldValueFilter } from "./domain/filters";
import { Play } from "./domain/play";
import { sortBy, union } from "lodash";
import { Game } from "./domain/game";

interface ReportFilterSelectorProps {
  game: Game;
  filters: ReportFilters;
  plays: Play[],
  onChange: (filters: ReportFilters) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  formControl: {
    margin: theme.spacing(4),
    minWidth: 160,
    maxWidth: 300,
  },
  selection: {
    minHeight: '28px',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  chip: {
    margin: 2,
  },
  clearButton: {
    marginLeft: '1em',
    marginTop: '20px',
  },
}));

function renderPlayerCount(playerCount: number | '' | null): React.ReactNode {
  if (typeof playerCount !== 'number') {
    return <em>Any number</em>;
  }
  return playerCount === 1 ? '1 player' : `${playerCount} players`;
}

function ReportFilterSelector({ game, plays, filters, onChange }: ReportFilterSelectorProps) {
  const classes = useStyles();
  const theme = useTheme();
  const playerCounts = sortBy(union(plays.map(play => play.rankings.length)));
  const [expansionsOpen, setExpansionsOpen] = useState(false);
  const [fieldsOpen, setFieldsOpen] = useState<Record<string, boolean>>({});
  const { expansions } = game;
  const isFiltering = hasFilters(filters);
  const reportFields = game.getRelevantReportFields()
    // TODO: Support fields without pre-defined options
    .filter(field => field.options?.length);
  return (
    <div className={classes.root}>
      {expansions && (
        <FormControl className={classes.formControl}>
          <InputLabel shrink>Expansions</InputLabel>
          <Select
            multiple
            displayEmpty
            value={filters.expansions}
            open={expansionsOpen}
            onOpen={() => setExpansionsOpen(true)}
            onClose={() => setExpansionsOpen(false)}
            onChange={(event) => {
              // Add the selected expansion to the filters
              const newExpansions = event.target.value as string[];
              onChange({ ...filters, expansions: newExpansions });
              setExpansionsOpen(false);
            }}
            input={<Input />}
            renderValue={(value) => {
              const expansionIds = value as string[];
              return (
                <div className={classes.selection}>
                  {!expansionIds.length ? <em>Any expansions</em> : expansionIds.map((expansionId) => (
                    <Chip
                      size="small"
                      key={expansionId}
                      className={classes.chip}
                      label={expansions.find(exp => exp.id === expansionId)?.name}
                    />
                  ))}
                </div>
              );
            }}
          >
            {expansions.map((expansion) => {
              const nestedFilters = toggleExpansionFilter(filters, expansion.id);
              const nestedPlays = applyPlayFilters(plays, nestedFilters);
              const isSelected = filters.expansions.includes(expansion.id);
              return (
                <MenuItem
                  key={expansion.id}
                  value={expansion.id}
                  disabled={!nestedPlays.length}
                  selected={isSelected}
                >
                  <ListItemText
                    primary={expansion.name}
                    secondary={`${nestedPlays.length} play(s)`}
                    primaryTypographyProps={{
                      style: {
                        fontWeight: isSelected ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
                      }
                    }}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      {reportFields.map((field) => (
        <FormControl className={classes.formControl} key={field.id}>
          <InputLabel shrink>{field.name} used</InputLabel>
          <Select
            multiple
            displayEmpty
            value={filters.fieldValues[field.id] ?? []}
            open={!!fieldsOpen[field.id]}
            onOpen={() => setFieldsOpen({ ...fieldsOpen, [field.id]: true })}
            onClose={() => setFieldsOpen({ ...fieldsOpen, [field.id]: false })}
            onChange={(event) => {
              const newValues = event.target.value as string[];
              onChange(setFieldValueFilter(filters, field.id, newValues));
              setFieldsOpen({ ...fieldsOpen, [field.id]: false });
            }}
            input={<Input />}
            renderValue={(renderValue) => {
              const values = renderValue as string[];
              return (
                <div className={classes.selection}>
                  {!values.length ? <em>Anything</em> : values.map((value) => (
                    <Chip
                      size="small"
                      key={value}
                      className={classes.chip}
                      label={field.options?.find(option => option.value === value)?.label ?? value}
                    />
                  ))}
                </div>
              );
            }}
          >
            {field.options?.map((option) => {
              const nestedFilters = toggleFieldValueFilter(filters, field.id, option.value);
              const nestedPlays = applyPlayFilters(plays, nestedFilters);
              const isSelected = !!filters.fieldValues[field.id]?.includes(option.value);
              return (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={!nestedPlays.length}
                  selected={isSelected}
                >
                  <ListItemText
                    primary={option.label}
                    secondary={`${nestedPlays.length} play(s)`}
                    primaryTypographyProps={{
                      style: {
                        fontWeight: isSelected ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
                      }
                    }}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      ))}
      <FormControl className={classes.formControl}>
        <InputLabel shrink>Player count</InputLabel>
        <Select
          displayEmpty
          value={filters.playerCount ?? ''}
          onChange={(event) => {
            const value = event.target.value as (string | number);
            const newPlayerCount = value === '' ? null : +value;
            onChange({ ...filters, playerCount: newPlayerCount });
          }}
          input={<Input />}
          renderValue={(playerCount) => (
            <div className={classes.selection}>
              {renderPlayerCount(playerCount as number)}
            </div>
          )}
        >
          {[null, ...playerCounts].map((playerCount) => {
            const nestedFilters: ReportFilters = { ...filters, playerCount };
            const nestedPlays = applyPlayFilters(plays, nestedFilters);
            const isSelected = playerCount === filters.playerCount;
            return (
              <MenuItem
                key={playerCount}
                value={playerCount ?? ''}
                disabled={!nestedPlays.length}
                selected={isSelected}
              >
                <ListItemText
                  primary={renderPlayerCount(playerCount)}
                  secondary={`${nestedPlays.length} play(s)`}
                  primaryTypographyProps={{
                    style: {
                      fontWeight: isSelected ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
                    }
                  }}
                />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button
        disabled={!isFiltering}
        color="secondary"
        variant={isFiltering ? 'contained' : 'outlined'}
        onClick={() => onChange(emptyFilters)}
        className={classes.clearButton}
      >
        Clear filters
      </Button>
    </div>
  )
}

export default ReportFilterSelector;

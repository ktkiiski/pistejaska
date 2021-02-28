import React, { useState } from "react";
import { Button, Chip, FormControl, Input, ListItemText, makeStyles, MenuItem, Select, useTheme } from "@material-ui/core";
import { applyPlayFilters, emptyFilters, hasFilters, ReportFilters, toggleExpansionFilter } from "./domain/filters";
import { Play } from "./domain/play";
import { sortBy, union } from "lodash";

interface ReportFilterSelectorProps {
  filters: ReportFilters;
  plays: Play[],
  onChange: (filters: ReportFilters) => void;
  expansions?: { id: string, name: string }[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  formControl: {
    margin: theme.spacing(4),
    minWidth: 200,
    maxWidth: 300,
  },
  selection: {
    minHeight: '36px',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

function renderPlayerCount(playerCount: number | '' | null): React.ReactNode {
  if (typeof playerCount !== 'number') {
    return <em>Any player count</em>;
  }
  return playerCount === 1 ? '1 player' : `${playerCount} players`;
}

function ReportFilterSelector({ plays, filters, onChange, expansions }: ReportFilterSelectorProps) {
  const classes = useStyles();
  const theme = useTheme();
  const playerCounts = sortBy(union(plays.map(play => play.rankings.length)));
  const [expansionsOpen, setExpansionsOpen] = useState(false);
  return (
    <div className={classes.root}>
      {expansions && (
        <FormControl className={classes.formControl}>
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
                  {!expansionIds.length ? <em>Expansions</em> : expansionIds.map((expansionId) => (
                    <Chip
                      key={`expansion:${expansionId}`}
                      className={classes.chip}
                      label={expansions?.find(exp => exp.id === expansionId)?.name}
                    />
                  ))}
                </div>
              );
            }}
          >
            <MenuItem value="" disabled>
              <em>Expansions</em>
            </MenuItem>
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
      <FormControl className={classes.formControl}>
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
      <Button disabled={!hasFilters(filters)} color="secondary" onClick={() => onChange(emptyFilters)}>
        Clear filters
      </Button>
    </div>
  )
}

export default ReportFilterSelector;

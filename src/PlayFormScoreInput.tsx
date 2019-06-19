import React, { useRef, useEffect } from "react";
import { Player, Play } from "./domain/play";
import { GameScoreFieldDefinition } from "./domain/game";
import { TextField, FormControl, InputLabel, Select, OutlinedInput } from "@material-ui/core";

interface PlayFormScoreInputProps {
  player: Player;
  field: GameScoreFieldDefinition;
  scores: Play;
  onChange: (score: number | null, field: GameScoreFieldDefinition, player: Player) => void;
  focusOnMe: boolean;
  onFocus: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const PlayFormScoreInput = (props: PlayFormScoreInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    player,
    field,
    scores,
    onChange,
    focusOnMe,
    onFocus,
    onKeyDown
  } = props;

  useEffect(() => {
    if (focusOnMe && inputRef.current != null) {
      inputRef.current.focus();
    }
  }, [focusOnMe]);

  const playerTotalScore =
    scores.scores
      .filter(s => s.playerId === player.id)
      .map(s => s.score)
      .reduce((s, memo) => s + memo, 0) || 0;

  const inputProps = {
    ref: inputRef,
    min: field.minValue,
    max: field.maxValue,
    step: field.step
  };

  const scoreItem = scores.scores.find(
    s => s.fieldId === field.id && s.playerId === player.id
  );
  const scoreValue = scoreItem ? scoreItem.score : "";
  const labelText = `${player.name} (${playerTotalScore} pts)`;
  const onValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let value = event.currentTarget.value as number | string | null;
    if (value === '') {
      // Chose a blank option
      value = null;
    } else if (typeof value === 'string') {
      value = parseInt(value, 10);
    }
    const score = value == null || Number.isNaN(value) ? null : value;
    onChange(score, field, player);
  };

  const { options } = field;
  if (options) {
    // Only allow choosing from pre-defined options.
    // If 0 is one of the allowed options, then let the zero option be seem
    // to be selected by default. Otherwise a blank option is selected by default.
    const hasZeroOption = options.some(({value}) => value === 0);
    const selectedScore = !scoreValue && hasZeroOption ? 0 : scoreValue;
    const hasSelectedValidOption = options.some(({value}) => value === selectedScore);
    return (
      <TextField
        select
        label={labelText}
        value={selectedScore}
        onChange={onValueChange}
        SelectProps={{ native: true }}
        margin="dense"
        variant="outlined"
      >
        {hasSelectedValidOption ? null : <option value=''></option>}
        {
          options.map(({value, label}) => (
            <option value={value} key={value}>{label}</option>
          ))
        }
      </TextField>
    );
  }

  return (
    <TextField
      margin="dense"
      inputProps={inputProps}
      type="number"
      variant="outlined"
      label={labelText}
      onFocus={e => (focusOnMe ? () => {} : onFocus(e))}
      onKeyDown={onKeyDown}
      value={scoreValue}
      onChange={onValueChange}
      id={field.name.replace(" ", "_").concat(player.id)}
    />
  );
};
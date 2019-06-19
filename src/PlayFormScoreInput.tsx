import React, { useRef, useEffect } from "react";
import { Player, Play } from "./domain/play";
import { GameScoreFieldDefinition } from "./domain/game";
import { TextField } from "@material-ui/core";

interface PlayFormScoreInputProps {
  player: Player;
  field: GameScoreFieldDefinition;
  scores: Play;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: GameScoreFieldDefinition,
    player: Player
  ) => void;
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

  return (
    <div>
      <TextField
        margin="dense"
        inputProps={inputProps}
        type="number"
        variant="outlined"
        label={`${player.name} (${playerTotalScore} pts)`}
        onFocus={e => (focusOnMe ? () => {} : onFocus(e))}
        onKeyDown={onKeyDown}
        value={scoreValue}
        onChange={e => onChange(e, field, player)}
        id={field.name.replace(" ", "_").concat(player.id)}
      />
    </div>
  );
};
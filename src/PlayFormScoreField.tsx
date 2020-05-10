import React from "react";
import { Player, Play } from "./domain/play";
import { GameScoreFieldDefinition } from "./domain/game";
import { PlayFormField } from "./PlayFormField";

interface PlayFormScoreFieldProps {
  player: Player;
  field: GameScoreFieldDefinition;
  play: Play;
  onChange: (
    score: number | null,
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

export const PlayFormScoreField = (props: PlayFormScoreFieldProps) => {
  const { player, field, play, onChange, ...fieldProps } = props;

  const playerTotalScore = play.getTotal(player.id);

  const scoreItem = play.scores.find(
    s => s.fieldId === field.id && s.playerId === player.id
  );
  const scoreValue = scoreItem ? scoreItem.score : null;
  const labelText = `${player.name} (${playerTotalScore} pts)`;
  return (
    <PlayFormField
      label={labelText}
      field={field}
      value={scoreValue}
      id={field.name.replace(" ", "_").concat(player.id)}
      onChange={(value, field) => onChange(value, field, player)}
      {...fieldProps}
    />
  );
};

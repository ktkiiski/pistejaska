import React from "react";
import { PlayFormField } from "./PlayFormField";
import { Player, Play } from "./domain/play";
import { GameMiscFieldDefinition } from "./domain/game";

type PlayFormMiscFieldProps = {
  field: GameMiscFieldDefinition;
  play: Play;
  onChange: (
    value: string,
    field: GameMiscFieldDefinition,
    player: Player | undefined
  ) => void;
  focusOnMe: boolean;
  onFocus: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  player?: Player;
};

export const PlayFormMiscField = (props: PlayFormMiscFieldProps) => {
  const { field, play, onChange, player, ...fieldProps } = props;
  const playerId = player && player.id;
  const value =
    (
      play.misc.find(m => m.fieldId === field.id && m.playerId === playerId) ||
      ({} as any)
    ).data ||
    (field.getDefaultValue && field.getDefaultValue()) ||
    null;
  return (
    <PlayFormField
      value={value}
      field={field}
      label={player ? player.name : field.name}
      onChange={(value, field) => onChange(value, field, player)}
      {...fieldProps}
    />
  );
};

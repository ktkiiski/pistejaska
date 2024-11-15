import React from "react";
import { PlayFormField } from "./PlayFormField";
import { Player, Play } from "./domain/play";
import { GameMiscFieldDefinition } from "./domain/game";

type PlayFormMiscFieldProps<T> = {
  field: GameMiscFieldDefinition<T>;
  fieldIndex: number;
  play: Play;
  onChange: (
    value: string,
    field: GameMiscFieldDefinition<T>,
    player: Player | undefined,
  ) => void;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  player?: Player;
  onImageUpload: (fieldId: string, file: File) => Promise<void>;
  onImageRemove: (value: string, field: GameMiscFieldDefinition<T>) => void;
};

export function PlayFormMiscField<T>(props: PlayFormMiscFieldProps<T>) {
  const {
    field,
    play,
    onChange,
    player,
    onImageUpload,
    onImageRemove,
    ...fieldProps
  } = props;
  const playerId = player && player.id;
  const value =
    (
      play.misc.find(
        (m) => m.fieldId === field.id && m.playerId === playerId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) || ({} as any)
    ).data ||
    (field.getDefaultValue && field.getDefaultValue()) ||
    null;
  return (
    <PlayFormField
      value={value}
      field={field}
      label={player ? player.name : field.name}
      play={play}
      onChange={(value, field) => onChange(value, field, player)}
      onImageUpload={(file) => onImageUpload(field.id, file)}
      onImageRemove={(value) => onImageRemove(value, field)}
      {...fieldProps}
    />
  );
}

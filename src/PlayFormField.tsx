import React, { useRef, useEffect } from "react";
import { GameFieldDefinition, GameFieldOption } from "./domain/game";
import { TextField, Button, Box } from "@material-ui/core";
import DurationCounter from "./DurationCounter";
import { Play } from "./domain/play";

interface PlayFormFieldProps<T, F extends GameFieldDefinition<T>> {
  value: T | null;
  field: F;
  label: string;
  play: Play;
  onChange: (score: T | null, field: F) => void;
  focusOnMe: boolean;
  onFocus: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  id?: string;
}

export function PlayFormField<
  T extends string | number | boolean,
  F extends GameFieldDefinition<T>
>(props: PlayFormFieldProps<T, F>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    value,
    field,
    label,
    play,
    onChange,
    focusOnMe,
    onFocus,
    onKeyDown,
    id,
  } = props;

  useEffect(() => {
    if (focusOnMe && inputRef.current != null) {
      inputRef.current.focus();
    }
  }, [focusOnMe]);

  const isNumeric = field.type === "number" || field.type === "duration";
  const createdAt = play.getCreationDate();
  const createdToday =
    new Date().getTime() - createdAt.getTime() < 24 * 60 * 60 * 1000;
  const inputProps = isNumeric
    ? {
        ref: inputRef,
        min: field.minValue,
        max: field.maxValue,
        step: field.step,
      }
    : {
        ref: inputRef,
      };

  const onValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let value = event.currentTarget.value as number | string | null;
    if (value === "" || value === null) {
      // Chose a blank option
      value = null;
    } else if (isNumeric) {
      value = typeof value === "string" ? parseFloat(value) : value;
      if (Number.isNaN(value)) {
        value = null;
      }
    } else {
      value = String(value);
    }
    onChange(value as T | null, field);
  };

  const onSetDurationFromStartClick = () => {
    const duration = play.getTimeInHoursSinceCreation();
    onChange(duration as T, field);
  };

  let options = field.options as
    | Array<GameFieldOption<string | number>>
    | undefined;
  if (field.type === "boolean") {
    options = [
      { value: "", label: "" },
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ];
  }
  if (options) {
    // Only allow choosing from pre-defined options.
    // If 0 is one of the allowed options, then let the zero option be seem
    // to be selected by default. Otherwise a blank option is selected by default.
    const hasZeroOption = options.some((option) => option.value === 0);
    const selectedValue = !value && hasZeroOption ? 0 : value || "";
    const hasSelectedValidOption = options.some(
      (option) => option.value === selectedValue
    );
    return (
      <div>
        <TextField
          select
          label={label}
          value={selectedValue}
          onChange={onValueChange}
          onFocus={(e) => (focusOnMe ? () => {} : onFocus(e))}
          onKeyDown={onKeyDown}
          inputProps={{ ref: inputRef }}
          SelectProps={{ native: true }}
          margin="dense"
          variant="outlined"
        >
          {hasSelectedValidOption ? null : <option value="" />}
          {options.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </TextField>
      </div>
    );
  }

  return (
    <>
      <div>
        <TextField
          margin="dense"
          inputProps={inputProps}
          type={isNumeric ? "number" : "text"}
          variant="outlined"
          label={label}
          onFocus={(e) => (focusOnMe ? () => {} : onFocus(e))}
          onKeyDown={onKeyDown}
          value={value === null ? "" : value}
          onChange={onValueChange}
          id={id}
        />
      </div>
      {field.type !== "duration" || !createdToday ? null : (
        <Box my={2}>
          <Button onClick={onSetDurationFromStartClick} variant="outlined">
            <span>
              Set from start (<DurationCounter startTime={createdAt} />)
            </span>
          </Button>
        </Box>
      )}
    </>
  );
}

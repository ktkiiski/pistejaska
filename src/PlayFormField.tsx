import React, { useRef, useEffect } from "react";
import { GameFieldDefinition, GameFieldOption } from "./domain/game";
import { TextField } from "@material-ui/core";

interface PlayFormFieldProps<T, F extends GameFieldDefinition<T>> {
  value: T | null,
  field: F;
  label: string;
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

export function PlayFormField<T extends string | number, F extends GameFieldDefinition<T>>(
  props: PlayFormFieldProps<T, F>,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    value,
    field,
    label,
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

  const inputProps = field.type === 'number' ? {
    ref: inputRef,
    min: field.minValue,
    max: field.maxValue,
    step: field.step,
  } : {
    ref: inputRef,
  };

  const onValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let value = event.currentTarget.value as number | string | null;
    if (value === '' || value == null) {
      // Chose a blank option
      value = null;
    } else if (field.type === 'number') {
      value = typeof value === 'string' ? parseFloat(value) : value;
      if (Number.isNaN(value)) {
        value = null;
      }
    } else {
      value = String(value);
    }
    onChange(value as T | null, field);
  };

  const options = field.options as Array<GameFieldOption<string | number>> | undefined;
  if (options) {
    // Only allow choosing from pre-defined options.
    // If 0 is one of the allowed options, then let the zero option be seem
    // to be selected by default. Otherwise a blank option is selected by default.
    const hasZeroOption = options.some(option => option.value === 0);
    const selectedValue = !value && hasZeroOption ? 0 : value || '';
    const hasSelectedValidOption = options.some(option => option.value === selectedValue);
    return (<div>
      <TextField
        select
        label={label}
        value={selectedValue}
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
    </div>);
  }

  return (<div>
    <TextField
      margin="dense"
      inputProps={inputProps}
      type={field.type === "number" ? "number" : "text"}
      variant="outlined"
      label={label}
      onFocus={e => (focusOnMe ? () => {} : onFocus(e))}
      onKeyDown={onKeyDown}
      value={value == null ? '' : value}
      onChange={onValueChange}
      id={id}
    />
  </div>);
};
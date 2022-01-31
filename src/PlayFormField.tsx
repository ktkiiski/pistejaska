import React from "react";
import { GameFieldDefinition, GameFieldOption } from "./domain/game";
import DurationCounter from "./DurationCounter";
import { Play } from "./domain/play";
import { useFormFieldRef } from "./utils/focus";
import ButtonUpload from "./common/components/buttons/ButtonUpload";
import Spinner from "./common/components/Spinner";
import InputTextField from "./common/components/inputs/InputTextField";
import InputNumberField from "./common/components/inputs/InputNumberField";
import SelectField from "./common/components/inputs/SelectField";
import ButtonLight from "./common/components/buttons/ButtonLight";

interface PlayFormFieldProps<T, F extends GameFieldDefinition<T>> {
  value: T | null;
  fieldIndex: number;
  field: F;
  label: string;
  play: Play;
  onChange: (score: T | null, field: F) => void;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  id?: string;
  onImageUpload?: (file: File) => Promise<void>;
  onImageRemove?: (filename: string) => void;
}

export function PlayFormField<
  T extends string | number | boolean | string[],
  F extends GameFieldDefinition<T>
>(props: PlayFormFieldProps<T, F>) {
  const {
    value,
    fieldIndex,
    field,
    label,
    play,
    onChange,
    onFocus,
    id,
    onImageUpload,
    onImageRemove,
  } = props;
  const inputRef = useFormFieldRef(fieldIndex);
  const isNumeric = field.type === "number" || field.type === "duration";
  const createdAt = play.getCreationDate();
  const createdToday =
    new Date().getTime() - createdAt.getTime() < 24 * 60 * 60 * 1000;

  const onSetDurationFromStartClick = () => {
    const duration = play.getTimeInHoursSinceCreation();
    onChange(duration as T, field);
  };

  let options = field.options as Array<GameFieldOption<T>> | undefined;
  if (field.type === "boolean") {
    options = [
      { value: "", label: "" },
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ] as GameFieldOption<T>[];
  }
  if (options) {
    // Only allow choosing from pre-defined options.
    // If 0 is one of the allowed options, then let the zero option be seem
    // to be selected by default. Otherwise a blank option is selected by default.
    const hasZeroOption = options.some((option) => option.value === 0);
    const selectedValue = !value && hasZeroOption ? (0 as T) : value;
    // ATM always allow deselecting an option. Let's discuss how this should work.
    const selectOptions = [
      {
        value: null,
        label: "",
      },
      ...options,
    ];
    return (
      <div>
        <SelectField
          className="w-60 max-w-full"
          label={label}
          options={selectOptions}
          value={selectedValue}
          onChange={(newValue) => onChange(newValue, field)}
          onFocus={onFocus}
          inputRef={inputRef}
        />
      </div>
    );
  }

  return field.type === "images" ? (
    <>
      <h5>Images</h5>
      <ButtonUpload
        idleLabel="Select image"
        uploadingLabel={
          <>
            <Spinner className="inline-block w-4 h-4 mr-2" />
            Uploading…
          </>
        }
        accept="image/*"
        onUpload={onImageUpload!}
      />

      {play.getImages().map((filename) => (
        <React.Fragment key={filename}>
          <div
            className="cursor-pointer"
            style={{ marginLeft: "180px" }}
            onClick={() => onImageRemove && onImageRemove(filename)}
          >
            ❌
          </div>
          <img src={play.getImageUrl(filename)} width={200} alt="Existing" />
        </React.Fragment>
      ))}
    </>
  ) : (
    <>
      <div>
        {isNumeric ? (
          <InputNumberField
            className="w-60 max-w-full"
            label={label}
            value={value as number | null}
            onChange={(newValue) => onChange(newValue as T | null, field)}
            id={id}
            onFocus={onFocus}
            inputRef={inputRef}
            min={field.minValue}
            max={field.maxValue}
            step={field.step}
          />
        ) : (
          <InputTextField
            className="w-60 max-w-full"
            label={label}
            value={value as string | ""}
            onChange={(newValue) =>
              onChange((newValue == null ? "" : newValue) as T | null, field)
            }
            id={id}
            onFocus={onFocus}
            inputRef={inputRef}
          />
        )}
      </div>
      {field.type !== "duration" || !createdToday ? null : (
        <div className="w-60 max-w-full">
          <ButtonLight
            onClick={onSetDurationFromStartClick}
            onFocus={onFocus}
            className="w-full"
          >
            {"Set from start "}
            <small>
              {"("}
              <DurationCounter startTime={createdAt} />
              {")"}
            </small>
          </ButtonLight>
        </div>
      )}
    </>
  );
}

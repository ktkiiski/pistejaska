import React from "react";
import { GameFieldDefinition, GameFieldOption } from "./domain/game";
import { TextField, Button, Box, makeStyles } from "@material-ui/core";
import DurationCounter from "./DurationCounter";
import { Play } from "./domain/play";
import { useFormFieldRef } from "./utils/focus";
import UploadButton from "./common/components/buttons/UploadButton";
import Spinner from "./common/components/Spinner";

const useFieldStyles = makeStyles({
  root: {
    width: "25ch",
    maxWidth: "100%",
  },
});

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
  const styles = useFieldStyles();
  const inputRef = useFormFieldRef(fieldIndex);
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

  const onValueChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
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
          onFocus={onFocus}
          inputProps={{ ref: inputRef }}
          SelectProps={{ native: true }}
          type="file"
          margin="dense"
          variant="outlined"
          classes={styles}
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

  return field.type === "images" ? (
    <>
      <h5>Images</h5>
      <UploadButton
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
        <TextField
          margin="dense"
          inputProps={inputProps}
          variant="outlined"
          label={label}
          onFocus={onFocus}
          type={isNumeric ? "number" : "text"}
          value={value === null ? "" : value}
          onChange={onValueChange}
          id={id}
          classes={styles}
        />
      </div>
      {field.type !== "duration" || !createdToday ? null : (
        <Box my={2}>
          <Button
            onClick={onSetDurationFromStartClick}
            variant="outlined"
            onFocus={onFocus}
          >
            <span>
              Set from start (<DurationCounter startTime={createdAt} />)
            </span>
          </Button>
        </Box>
      )}
    </>
  );
}

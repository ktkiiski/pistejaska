import { ChangeEvent, ChangeEventHandler, FocusEventHandler, Ref } from "react";
import useId from "../../hooks/useId";
import InputBase from "./FieldBase";
import fieldStyles from "./FieldBase.module.css";

interface NativeSelectFieldOption<Value> {
  value: Value;
  label: string;
  disabled?: boolean;
}

interface NativeSelectFieldProps<Value> {
  label: string;
  className?: string;
  id?: string;
  onFocus?: FocusEventHandler<HTMLSelectElement>;
  inputRef?: Ref<HTMLSelectElement>;
  value: Value;
  options: NativeSelectFieldOption<Value>[];
  onChange: (value: Value, event: ChangeEvent<HTMLSelectElement>) => void;
}

function NativeSelectField<Value>(props: NativeSelectFieldProps<Value>) {
  const { id, label, value, options, className, onChange, onFocus, inputRef } =
    props;
  const inputId = useId("select-", id);
  const encodedOptions = options.map((option) => ({
    ...option,
    encodedValue: JSON.stringify(option.value),
  }));
  const selectedEncodedValue = JSON.stringify(value);
  const selectedOption = encodedOptions.find(
    (option) => option.encodedValue === selectedEncodedValue
  );
  const onSelectChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;
    const selectedEncodedOption = encodedOptions.find(
      (option) => option.encodedValue === value
    );
    if (selectedEncodedOption) {
      onChange(selectedEncodedOption.value, event);
    }
  };
  return (
    <InputBase
      className={className}
      label={label}
      labelFor={inputId}
      hasValue={selectedOption != null && !!selectedOption.label}
    >
      <select
        id={inputId}
        className={fieldStyles.input}
        value={selectedEncodedValue}
        onChange={onSelectChange}
        onFocus={onFocus}
        ref={inputRef}
      >
        {selectedOption ? null : (
          <option value={selectedEncodedValue} disabled />
        )}
        {encodedOptions.map((option) => (
          <option
            key={option.encodedValue}
            value={option.encodedValue}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </InputBase>
  );
}

export default NativeSelectField;

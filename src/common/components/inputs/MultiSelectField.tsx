import { FocusEventHandler, Ref, useState } from "react";
import useId from "../../hooks/useId";
import DropdownMenu from "../dropdowns/DropdownMenu";
import InputBase from "./FieldBase";
import styles from "./MultiSelectField.module.css";

interface MultiSelectFieldOption<Value> {
  value: Value;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface MultiSelectFieldProps<Value> {
  label: string;
  className?: string;
  id?: string;
  onFocus?: FocusEventHandler<HTMLSelectElement>;
  inputRef?: Ref<HTMLSelectElement>;
  values: Value[];
  options: MultiSelectFieldOption<Value>[];
  onChange: (values: Value[]) => void;
}

function MultiSelectField<Value>(props: MultiSelectFieldProps<Value>) {
  const { id, label, values, options, className, onChange } = props;
  const inputId = useId("multi-select-", id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const encodedOptions = options.map((option) => ({
    ...option,
    encodedValue: JSON.stringify(option.value),
  }));
  const selectedEncodedValues = values.map((value) => JSON.stringify(value));
  const selectedOptions = encodedOptions.filter((option) =>
    selectedEncodedValues.includes(option.encodedValue)
  );
  return (
    <InputBase
      className={className}
      label={label}
      hasValue={selectedOptions.length > 0}
    >
      <DropdownMenu
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        options={encodedOptions.map((option) => ({
          ...option,
          selected: selectedEncodedValues.includes(option.encodedValue),
        }))}
        onSelect={(value) => {
          const newValues = values.includes(value)
            ? values.filter((val) => val !== value)
            : [...values, value];
          onChange(newValues);
          setIsDropdownOpen(false);
        }}
      >
        <button
          id={inputId}
          className={styles.input}
          onClick={() => setIsDropdownOpen(true)}
        >
          {selectedOptions.map((option) => (
            <span className={styles.badge} key={option.encodedValue}>
              {option.label}
            </span>
          ))}
          {selectedOptions.length ? null : (
            <span className={styles.placeholder}>&nbsp;</span>
          )}
        </button>
      </DropdownMenu>
    </InputBase>
  );
}

export default MultiSelectField;

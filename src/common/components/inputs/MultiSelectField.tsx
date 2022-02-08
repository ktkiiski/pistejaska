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
  const selectedEncodedValues = values.map((value) => JSON.stringify(value));
  const dropdownOptions = options.map((option) => {
    const encodedValue = JSON.stringify(option.value);
    return {
      ...option,
      selected: selectedEncodedValues.includes(encodedValue),
      encodedValue,
    };
  });
  const selectedDropdownOptions = dropdownOptions.filter(
    (option) => option.selected
  );
  return (
    <InputBase
      className={className}
      label={label}
      hasValue={selectedDropdownOptions.length > 0}
    >
      <DropdownMenu
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        options={dropdownOptions}
        overlaySelectedOption
        onSelect={(option) => {
          const newSelectedOptions = option.selected
            ? selectedDropdownOptions.filter((opt) => opt !== option)
            : dropdownOptions.filter((opt) => opt.selected || option === opt);
          const newValues = newSelectedOptions.map((opt) => opt.value);
          onChange(newValues);
          setIsDropdownOpen(false);
        }}
      >
        <button
          id={inputId}
          className={styles.input}
          onClick={() => setIsDropdownOpen(true)}
        >
          {/* This element makes sure that the input has a minimum size that fits the label text */}
          <span
            className={
              selectedDropdownOptions.length
                ? styles.minWidthFiller
                : styles.placeholder
            }
            aria-hidden
          >
            {label}
          </span>
          <div className={styles.badges}>
            {selectedDropdownOptions.map((option) => (
              <span className={styles.badge} key={option.encodedValue}>
                {option.label}
              </span>
            ))}
          </div>
        </button>
      </DropdownMenu>
    </InputBase>
  );
}

export default MultiSelectField;

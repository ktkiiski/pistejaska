import { FocusEventHandler, ReactNode, SyntheticEvent, useState } from "react";
import useId from "../../hooks/useId";
import DropdownMenu from "../dropdowns/DropdownMenu";
import InputBase from "./FieldBase";
import styles from "./SelectField.module.css";

interface SelectFieldOption<Value> {
  value: Value;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  hideSelectedLabel?: boolean;
}

interface SelectFieldProps<Value> {
  label: string;
  className?: string;
  id?: string;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  value: Value;
  options: SelectFieldOption<Value>[];
  onChange: (value: Value, event: SyntheticEvent) => void;
}

function SelectField<Value>(props: SelectFieldProps<Value>) {
  const { id, label, value, options, className, onChange, onFocus } = props;
  const inputId = useId("select-", id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedEncodedValue = JSON.stringify(value);
  const dropdownOptions = options.map((option) => ({
    ...option,
    selected: JSON.stringify(option.value) === selectedEncodedValue,
  }));
  const selectedOption = dropdownOptions.find((option) => option.selected);
  const hideSelectedLabel = selectedOption?.hideSelectedLabel;
  const selectedLabel = selectedOption?.label;
  const hasVisibleLabel = !hideSelectedLabel && !!selectedLabel;
  return (
    <InputBase
      className={className}
      label={label}
      labelFor={inputId}
      hasValue={hasVisibleLabel}
    >
      <DropdownMenu
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        options={dropdownOptions}
        onSelect={(option, event) => {
          onChange(option.value, event);
          setIsDropdownOpen(false);
        }}
      >
        <button
          id={inputId}
          className={styles.input}
          onClick={() => setIsDropdownOpen(true)}
          onFocus={onFocus}
        >
          {/* This element makes sure that the input has a minimum size that fits the label text */}
          <span
            className={
              hasVisibleLabel ? styles.minWidthFiller : styles.placeholder
            }
            aria-hidden
          >
            {label}
          </span>
          {hasVisibleLabel && selectedLabel}
        </button>
      </DropdownMenu>
    </InputBase>
  );
}

export default SelectField;

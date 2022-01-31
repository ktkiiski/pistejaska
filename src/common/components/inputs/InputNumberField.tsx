import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  Ref,
  VFC,
} from "react";
import FieldBase from "./FieldBase";

interface InputNumberFieldProps {
  label: string;
  className?: string;
  id?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  inputRef?: Ref<HTMLInputElement>;
  value: number | null;
  onChange: (
    value: number | null,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  min?: number;
  max?: number;
  step?: number;
  autoFocus?: boolean;
}

const InputNumberField: VFC<InputNumberFieldProps> = (props) => {
  const {
    id,
    label,
    value,
    className,
    onChange,
    onFocus,
    inputRef,
    autoFocus,
  } = props;
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value.trim();
    const numeric = value === "" ? null : +value;
    onChange(Number.isFinite(numeric) ? numeric : null, event);
  };
  return (
    <FieldBase className={className} label={label} hasValue={value != null}>
      <input
        id={id}
        type="number"
        value={value == null ? "" : value.toString()}
        onChange={onInputChange}
        onFocus={onFocus}
        ref={inputRef}
        autoFocus={autoFocus}
      />
    </FieldBase>
  );
};

export default InputNumberField;

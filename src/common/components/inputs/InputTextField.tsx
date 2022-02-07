import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  Ref,
  VFC,
} from "react";
import useId from "../../hooks/useId";
import FieldBase from "./FieldBase";
import fieldStyles from "./FieldBase.module.css";

interface InputTextFieldProps {
  label: string;
  className?: string;
  id?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  inputRef?: Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

const InputTextField: VFC<InputTextFieldProps> = (props) => {
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
  const inputId = useId("input-text-", id);
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    onChange(value, event);
  };
  return (
    <FieldBase
      className={className}
      label={label}
      labelFor={inputId}
      hasValue={!!value}
    >
      <input
        id={inputId}
        className={fieldStyles.input}
        type="text"
        value={value == null ? "" : value.toString()}
        onChange={onInputChange}
        onFocus={onFocus}
        ref={inputRef}
        autoFocus={autoFocus}
      />
    </FieldBase>
  );
};

export default InputTextField;

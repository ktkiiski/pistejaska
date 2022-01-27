import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  Ref,
  VFC,
} from "react";
import InputBase from "./FieldBase";

interface InputTextFieldProps {
  label: string;
  className?: string;
  id?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  inputRef?: Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const InputTextField: VFC<InputTextFieldProps> = (props) => {
  const { id, label, value, className, onChange, onFocus, inputRef } = props;
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    onChange(value, event);
  };
  return (
    <InputBase className={className} label={label} hasValue={!!value}>
      <input
        id={id}
        type="text"
        value={value == null ? "" : value.toString()}
        onChange={onInputChange}
        onFocus={onFocus}
        ref={inputRef}
      />
    </InputBase>
  );
};

export default InputTextField;

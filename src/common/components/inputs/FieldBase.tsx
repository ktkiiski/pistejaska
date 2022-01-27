import classNames from "classnames";
import { cloneElement, ReactElement, useState, VFC } from "react";
import styles from "./FieldBase.module.css";

interface FieldElementProps {
  id?: string;
  className?: string;
}

interface InputBaseProps {
  label: string;
  className?: string;
  children: ReactElement<FieldElementProps>;
  hasValue: boolean;
}

let counter = 0;

const labelClassName = classNames(
  "text-base top-5 left-3 text-slate-500",
  styles.label
);
const inputClassName = classNames("py-2 px-3 text-base", styles.input);
const fieldsetClassName = classNames(
  "rounded-md border border-solid border-slate-400/40",
  styles.fieldset
);
const legendClassName = classNames("ml-2", styles.legend);

/**
 * Low-level component for building consistently looking form input/select components.
 */
const InputBase: VFC<InputBaseProps> = (props) => {
  const { label, className, hasValue, children } = props;
  const inputId = children.props.id;
  const [staticId] = useState(() => `input-${counter++}`);
  const id = inputId ?? staticId;
  const inputElement = cloneElement(children, {
    id,
    className: classNames(inputClassName, children.props.className),
  });
  return (
    <div
      className={classNames(
        "pt-3 relative",
        className,
        hasValue && styles.hasValue
      )}
    >
      {inputElement}
      <label className={labelClassName} htmlFor={inputId}>
        {label}
      </label>
      <fieldset className={fieldsetClassName}>
        <legend className={legendClassName}>
          <span className="px-1 invisible">{label}</span>
        </legend>
      </fieldset>
    </div>
  );
};

export default InputBase;

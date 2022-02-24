import classNames from "classnames";
import { FC } from "react";
import styles from "./FieldBase.module.css";

interface InputBaseProps {
  label: string;
  labelFor?: string;
  className?: string;
  hasValue: boolean;
}

const labelClassName = classNames("text-slate-500", styles.label);
const fieldsetClassName = classNames(
  "rounded-md border border-solid border-slate-400/40",
  styles.fieldset
);
const legendClassName = classNames("ml-2", styles.legend);

/**
 * Low-level component for building consistently looking form input/select components.
 */
const InputBase: FC<InputBaseProps> = (props) => {
  const { label, labelFor, className, hasValue, children } = props;
  return (
    <div
      className={classNames(
        styles.container,
        className,
        hasValue && styles.hasValue
      )}
    >
      {children}
      <label className={labelClassName} htmlFor={labelFor}>
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

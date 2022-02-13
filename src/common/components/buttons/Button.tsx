import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      props.disabled
        ? "text-slate-400 bg-slate-300 hover:bg-slate-300"
        : "bg-slate-500 hover:bg-slate-600",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default Button;

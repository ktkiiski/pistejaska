import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const ButtonDanger: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      props.disabled
        ? "text-slate-400 bg-slate-300"
        : "bg-red-600 hover:bg-red-700",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonDanger;

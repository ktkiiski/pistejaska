import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const ButtonLight: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      "bg-white",
      props.disabled
        ? "text-slate-300"
        : "text-blue-500 hover:text-blue-600 hover:bg-blue-100",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonLight;

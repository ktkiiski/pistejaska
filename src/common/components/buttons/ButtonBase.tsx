import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import { buttonBaseClassName } from "./ButtonBase.utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  connectLeft?: boolean;
  connectRight?: boolean;
}

const ButtonBase: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  disabled,
  type,
  connectLeft,
  connectRight,
  ...props
}) => (
  <button
    className={classNames(
      buttonBaseClassName,
      className,
      connectLeft && "rounded-l-none",
      connectRight && "rounded-r-none",
    )}
    onClick={!disabled ? onClick : undefined}
    type={type ?? "button"}
    {...props}
  >
    {children}
  </button>
);

export default ButtonBase;

import classNames from "classnames";
import {
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";

export const buttonBaseClassName = `inline-block px-4 py-3
text-sm font-semibold text-center
text-white uppercase transition
duration-200 ease-in-out
shadow-md
rounded-full
cursor-pointer`.replace(/\s+/g, " ");

export interface ButtonProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
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
      connectRight && "rounded-r-none"
    )}
    onClick={!disabled ? onClick : undefined}
    type={type ?? "button"}
    {...props}
  >
    {children}
  </button>
);

export default ButtonBase;

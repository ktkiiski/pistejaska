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
        ? "text-gray-400 bg-gray-300 hover:bg-gray-300"
        : "bg-gray-500 hover:bg-gray-600",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default Button;

import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const ButtonTextOnly: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      "shadow-transparent bg-transparent",
      props.disabled
        ? "text-gray-300"
        : "text-blue-500 hover:text-blue-600 hover:bg-blue-400/10",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonTextOnly;

import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const ButtonPrimary: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      props.disabled
        ? "text-gray-400 bg-gray-300"
        : "bg-purple-700 hover:bg-purple-800",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonPrimary;

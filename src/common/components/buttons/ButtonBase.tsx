import { ButtonHTMLAttributes } from "react";

export const buttonBaseClassName = `inline-block px-4 py-3
text-sm font-semibold text-center
text-white uppercase transition
duration-200 ease-in-out
shadow-md
rounded-full
cursor-pointer`.replace(/\s+/g, " ");

const ButtonBase: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  onClick,
  className,
  disabled,
  ...props
}) => (
  <button
    className={`${buttonBaseClassName} ${className}
    `}
    onClick={disabled || !onClick ? () => {} : onClick}
    {...props}
  >
    {children}
  </button>
);

export default ButtonBase;

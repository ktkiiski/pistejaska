import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <ButtonBase
    {...props}
    className={`$
    bg-gray-500
    hover:bg-gray-600
    ${props.disabled ? "text-gray-400 bg-gray-300 hover:bg-gray-300" : ""}
    ${props.className || ""}`}
  >
    {props.children}
  </ButtonBase>
);

export default Button;

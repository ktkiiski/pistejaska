import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const ButtonPrimary: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => (
  <ButtonBase
    {...props}
    className={`
bg-purple-700 hover:bg-purple-800 ${
      props.disabled ? "text-gray-400 bg-gray-300 hover:bg-gray-300" : ""
    } ${props.className || ""}`}
  >
    {props.children}
  </ButtonBase>
);

export default ButtonPrimary;

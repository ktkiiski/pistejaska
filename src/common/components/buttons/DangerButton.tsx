import { ButtonHTMLAttributes } from "react";
import ButtonBase from "./ButtonBase";

const ButtonDanger: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => (
  <ButtonBase
    {...props}
    className={`
    bg-red-600 hover:bg-red-700 ${
      props.disabled ? "text-gray-400 bg-gray-300 hover:bg-gray-300" : ""
    }  ${props.className || ""}`}
  >
    {props.children}
  </ButtonBase>
);

export default ButtonDanger;

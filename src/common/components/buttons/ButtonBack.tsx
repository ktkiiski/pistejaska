import { MouseEventHandler } from "react";
import { IconBack } from "../icons/IconBack";
import Button from "./Button";

interface ButtonBackProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const ButtonBack: React.FC<ButtonBackProps> = ({ onClick }) => (
  <Button onClick={onClick} className="px-4 py-4">
    <IconBack />
  </Button>
);

export default ButtonBack;

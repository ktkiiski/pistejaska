import classNames from "classnames";
import ButtonBase, { ButtonProps } from "./ButtonBase";

const ButtonLight: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      "bg-white",
      props.disabled
        ? "text-slate-300"
        : "text-blue-500 hover:text-blue-600 hover:bg-blue-100",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonLight;

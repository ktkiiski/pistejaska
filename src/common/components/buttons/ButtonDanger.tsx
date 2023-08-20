import classNames from "classnames";
import ButtonBase, { ButtonProps } from "./ButtonBase";

const ButtonDanger: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      "text-white",
      props.disabled
        ? "text-slate-400 bg-slate-300"
        : "bg-red-600 hover:bg-red-700",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonDanger;

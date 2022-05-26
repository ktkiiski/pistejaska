import classNames from "classnames";
import ButtonBase, { ButtonProps } from "./ButtonBase";

const ButtonPrimary: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      props.disabled
        ? "text-slate-400 bg-slate-300"
        : "bg-purple-700 hover:bg-purple-800",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonPrimary;

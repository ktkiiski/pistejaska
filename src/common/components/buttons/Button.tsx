import classNames from "classnames";
import ButtonBase, { ButtonProps } from "./ButtonBase";

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => (
  <ButtonBase
    {...props}
    className={classNames(
      props.disabled
        ? "text-slate-400 bg-slate-300 hover:bg-slate-300"
        : "bg-slate-500 hover:bg-slate-600",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default Button;

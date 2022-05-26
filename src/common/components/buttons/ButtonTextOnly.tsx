import classNames from "classnames";
import ButtonBase, { ButtonProps } from "./ButtonBase";

const ButtonTextOnly: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => (
  <ButtonBase
    {...props}
    className={classNames(
      "shadow-transparent bg-transparent",
      props.disabled
        ? "text-slate-300"
        : "text-blue-500 hover:text-blue-600 hover:bg-blue-400/10",
      className
    )}
  >
    {children}
  </ButtonBase>
);

export default ButtonTextOnly;

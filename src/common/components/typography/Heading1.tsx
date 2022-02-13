import classNames from "classnames";
import { HTMLAttributes } from "react";

const Heading1: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h1
    className={classNames(
      "text-center text-3xl font-bold text-slate-800 mb-2 p-2",
      className
    )}
    {...props}
  >
    {children}
  </h1>
);

export default Heading1;

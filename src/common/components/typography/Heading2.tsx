import classNames from "classnames";
import { HTMLAttributes } from "react";

const Heading2: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h2
    className={classNames(
      "text-center text-xl font-bold text-slate-500 mt-4 mb-2",
      className
    )}
    {...props}
  >
    {children}
  </h2>
);

export default Heading2;

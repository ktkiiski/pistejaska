import classNames from "classnames";
import { HTMLAttributes } from "react";

const Heading3: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3
    className={classNames(
      "text-center text-lg font-bold text-gray-500 mt-3 mb-2",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export default Heading3;

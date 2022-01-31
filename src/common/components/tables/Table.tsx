import classNames from "classnames";
import { HTMLAttributes } from "react";

const Table: React.FC<HTMLAttributes<HTMLTableElement>> = ({
  children,
  className,
  ...props
}) => (
  <table
    className={classNames(
      "border-collapse table-auto w-full lg:text-base text-xs",
      className
    )}
    {...props}
  >
    {children}
  </table>
);

export default Table;

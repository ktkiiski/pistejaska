import classNames from "classnames";
import { HTMLAttributes } from "react";

const Table: React.FC<HTMLAttributes<HTMLTableElement>> = ({
  children,
  className,
  ...props
}) => (
  <table
    className={classNames(
      "bg-white border-collapse table-auto w-full lg:text-base text-xs rounded overflow-hidden shadow",
      className
    )}
    {...props}
  >
    {children}
  </table>
);

export default Table;

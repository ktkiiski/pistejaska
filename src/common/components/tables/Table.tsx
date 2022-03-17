import classNames from "classnames";
import { HTMLAttributes } from "react";

const Table: React.FC<HTMLAttributes<HTMLTableElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className="overflow-x-auto">
    <table
      className={classNames(
        "bg-white border-collapse table-auto lg:text-base text-xs rounded w-full shadow",
        className
      )}
      {...props}
    >
      {children}
    </table>
  </div>
);

export default Table;

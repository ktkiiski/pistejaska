import classNames from "classnames";
import { HTMLAttributes } from "react";

const TableHeadCell: React.FC<HTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => (
  <td
    className={classNames(
      "border-b font-medium p-1 py-3 text-gray-700 text-left break-all truncate overflow-hidden",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

export default TableHeadCell;

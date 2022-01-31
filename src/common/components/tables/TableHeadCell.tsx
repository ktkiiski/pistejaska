import classNames from "classnames";
import { TdHTMLAttributes } from "react";

const TableHeadCell: React.FC<TdHTMLAttributes<HTMLTableCellElement>> = ({
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

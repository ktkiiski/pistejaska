import classNames from "classnames";
import { HTMLAttributes } from "react";

const TableCell: React.FC<HTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => (
  <td
    className={classNames(
      "border-b border-gray-200 p-1 text-gray-700",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

export default TableCell;

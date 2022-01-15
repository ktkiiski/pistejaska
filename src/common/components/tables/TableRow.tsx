import { HTMLAttributes } from "react";

const TableRow: React.FC<HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  ...props
}) => <tr {...props}>{children}</tr>;

export default TableRow;

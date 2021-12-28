import React, { HTMLAttributes } from "react";

export const TailwindTableHead: React.FC = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);
export const TailwindTableHeadCell: React.FC<
  HTMLAttributes<HTMLTableCellElement>
> = ({ children, className, ...props }) => (
  <td
    className={`border-b font-medium p-1 py-3 text-gray-700 text-left break-all truncate overflow-hidden ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </td>
);
export const TailwindTableCell: React.FC<
  HTMLAttributes<HTMLTableCellElement>
> = ({ children, className, ...props }) => (
  <td
    className={`border-b border-gray-200 p-1 text-gray-700 ${className || ""}`}
    {...props}
  >
    {children}
  </td>
);
export const TailwindTableRow: React.FC<
  HTMLAttributes<HTMLTableRowElement>
> = ({ children, ...props }) => <tr {...props}>{children}</tr>;

export const TailwindTableFooter: React.FC = ({ children }) => (
  <tfoot className="bg-gray-200">{children}</tfoot>
);
export const TailwindTableBody: React.FC = ({ children }) => (
  <tbody>{children}</tbody>
);

export const TailwindTable: React.FC = ({ children }) => (
  <table className="border-collapse table-auto w-full lg:text-base text-xs">
    {children}
  </table>
);

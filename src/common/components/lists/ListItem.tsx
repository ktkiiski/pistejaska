import classNames from "classnames";
import { HTMLAttributes } from "react";

export const listItemClassName =
  "flex flex-row select-none flex flex-1 items-center px-4 py-2";
export const listItemInteractiveClassName = classNames(
  listItemClassName,
  "cursor-pointer hover:bg-slate-50"
);

const ListItem: React.FC<HTMLAttributes<HTMLLIElement>> = ({
  className,
  children,
  onClick,
  ...props
}) => {
  return (
    <li
      className={classNames(
        onClick ? listItemInteractiveClassName : listItemClassName,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </li>
  );
};

export default ListItem;

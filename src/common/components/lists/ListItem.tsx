import classNames from "classnames";
import { HTMLAttributes } from "react";
import {
  listItemInteractiveClassName,
  listItemClassName,
} from "./ListItem.utils";

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
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </li>
  );
};

export default ListItem;

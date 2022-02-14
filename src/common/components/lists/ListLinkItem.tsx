import classNames from "classnames";
import { Link, LinkProps } from "react-router-dom";
import { listItemInteractiveClassName } from "./ListItem";

const listLinkItemClassName = classNames(
  listItemInteractiveClassName,
  "cursor-pointer hover:bg-gray-100"
);

const ListLinkItem: React.FC<LinkProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <li className={className}>
      <Link className={listLinkItemClassName} {...props}>
        {children}
      </Link>
    </li>
  );
};

export default ListLinkItem;

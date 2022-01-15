import classNames from "classnames";
import { HTMLAttributes } from "react";

const ListItemIcon: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={classNames(
      "flex flex-col justify-center items-center mr-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default ListItemIcon;

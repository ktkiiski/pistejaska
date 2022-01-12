import { FC, HTMLAttributes } from "react";
import classNames from "classnames";

const TabSet: FC<HTMLAttributes<HTMLUListElement>> = ({
  children,
  className,
  ...props
}) => (
  <ul
    className={classNames(
      "flex flex-row justify-start items-stretch",
      className
    )}
    {...props}
  >
    {children}
  </ul>
);

export default TabSet;

import { AnchorHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

interface TabProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  className?: string;
  active?: boolean;
}

const TabLink: FC<TabProps> = ({ children, className, active, ...props }) => {
  return (
    <li className="flex flex-row items-stretch">
      <a
        className={classNames(
          "cursor-pointer py-2 px-2 md:px-4 border-b-8 flex flex-col items-center justify-center text-center",
          active
            ? "text-blue-500 border-blue-500"
            : "text-slate-500 hover:text-slate-600 border-slate-200",
          className
        )}
        {...props}
      >
        {children}
      </a>
    </li>
  );
};

export default TabLink;

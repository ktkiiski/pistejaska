import { HTMLAttributes } from "react";

const ListItem: React.FC<HTMLAttributes<HTMLLIElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <li className="flex flex-row" {...props}>
      <div
        className={`select-none cursor-pointer flex flex-1 items-center px-4 py-2 hover:bg-slate-50 ${
          className || ""
        }`}
      >
        {children}
      </div>
    </li>
  );
};

export default ListItem;

import classNames from "classnames";
import { forwardRef, MouseEventHandler, ReactNode } from "react";

interface DropdownListItemProps {
  label: ReactNode;
  description?: ReactNode | null;
  disabled?: boolean;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLLIElement>;
}

const DropdownListItem = forwardRef<HTMLLIElement, DropdownListItemProps>(
  ({ label, description, disabled, selected, onClick }, ref) => (
    <li
      className={classNames(
        "py-2 pl-3 pr-5 cursor-pointer",
        disabled ? "text-slate-300" : "text-slate-800 hover:bg-slate-200",
        selected ? "bg-slate-100 font-semibold text-black" : "font-light"
      )}
      onClick={disabled ? undefined : onClick}
      ref={ref}
    >
      <span className="block text-md">{label}</span>
      {description == null ? null : (
        <span className="block text-xs opacity-70">{description}</span>
      )}
    </li>
  )
);

export default DropdownListItem;

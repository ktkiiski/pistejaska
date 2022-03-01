import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";
import { useCallback, useState, VFC } from "react";
import { convertToLocaleTimeString } from "../../dateUtils";
import useLongPress from "../../hooks/useLongPress";
import DropdownMenu from "../dropdowns/DropdownMenu";
import Markdown from "../Markdown";

interface CommentItemProps {
  children: string;
  date: Temporal.Instant;
  onDelete: (() => void) | null;
}

const actionMenuIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 29.96 122.88"
    className="w-3/6 h-3/6"
  >
    <path
      fill="currentColor"
      d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z"
    />
  </svg>
);

const CommentItem: VFC<CommentItemProps> = ({ children, date, onDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const openDropdown = useCallback(() => setIsDropdownOpen(true), []);
  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
  const longPressEventHandlers = useLongPress<HTMLDivElement>(openDropdown);
  return (
    <div className="flex flex-row items-center group">
      <div
        className="py-2 px-3 rounded-l rounded-r-2xl group-first:rounded-tl-2xl group-last:rounded-bl-2xl bg-white active:bg-gray-200 transition shadow"
        data-tip={date.toLocaleString()}
        data-delay-show={500}
        {...longPressEventHandlers}
      >
        <div className="float-right text-xs text-slate-300 mt-0.5 ml-3 mb-2">
          {convertToLocaleTimeString(date, { timeStyle: "short" })}
        </div>
        <Markdown>{children}</Markdown>
      </div>
      <DropdownMenu
        isOpen={isDropdownOpen}
        onClose={closeDropdown}
        onSelect={closeDropdown}
        options={[
          {
            label: "Delete",
            value: "delete",
            disabled: onDelete == null,
            onSelect: onDelete ?? undefined,
          },
        ]}
      >
        <button
          className={classNames(
            "ml-2 hover:text-slate-500 hover:bg-gray-200 w-7 h-7 flex items-center justify-center cursor-pointer rounded-full shrink-0 group-hover:visible",
            isDropdownOpen
              ? "visible text-slate-500 bg-gray-200"
              : "invisible text-slate-300"
          )}
          onClick={openDropdown}
        >
          {actionMenuIcon}
        </button>
      </DropdownMenu>
    </div>
  );
};

export default CommentItem;

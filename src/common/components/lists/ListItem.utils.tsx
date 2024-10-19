import classNames from "classnames";

export const listItemClassName =
  "flex flex-row select-none flex flex-1 items-center px-4 py-2";
export const listItemInteractiveClassName = classNames(
  listItemClassName,
  "cursor-pointer hover:bg-slate-50",
);

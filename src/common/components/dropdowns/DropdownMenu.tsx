import classNames from "classnames";
import {
  Children,
  cloneElement,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

interface DropdownMenuOption<Value> {
  label: ReactNode;
  description?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  value: Value;
}

interface DropdownMenuProps<Value> {
  options: DropdownMenuOption<Value>[];
  isOpen: boolean;
  onSelect: (
    value: Value,
    option: DropdownMenuOption<Value>,
    event: SyntheticEvent
  ) => void;
  onClose: (event: SyntheticEvent) => void;
  children: ReactElement;
}

function DropdownMenu<Value>({
  children,
  onClose,
  onSelect,
  options,
  isOpen,
}: DropdownMenuProps<Value>) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLUListElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const singleChild = cloneElement(Children.only(children), { ref: anchorRef });
  const onBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!popoverRef.current?.contains(event.target as Node)) {
      onClose(event);
    }
  };
  /**
   * Make the main browser window unscrollable while open.
   */
  useEffect(() => {
    const { classList } = document.body;
    if (isOpen) {
      classList.add("overflow-hidden");
    } else {
      classList.remove("overflow-hidden");
    }
  }, [isOpen]);
  /**
   * Position the dropdown menu according to the child element.
   */
  useEffect(() => {
    const left = leftRef.current;
    const top = topRef.current;
    const anchor = anchorRef.current;
    if (anchor && left && top) {
      const position = anchor.getBoundingClientRect();
      left.style.maxWidth = `${position.left}px`;
      top.style.maxHeight = `${position.top}px`;
    }
  });
  const dropdown = isOpen && (
    <div
      className="fixed inset-0 overflow-hidden flex flex-row items-stretch"
      onClick={onBackdropClick}
    >
      <div className="grow shrink-0 basis-2" ref={leftRef} />
      <div className="grow flex flex-col">
        <div className="grow shrink-0 basis-2" ref={topRef} />
        <ul
          className="shrink grow-0 w-40 min-w-fit overflow-y-auto overflow-x-hidden bg-white shadow-lg shadow-black/50 rounded"
          ref={popoverRef}
        >
          {options.map((option) => (
            <li
              key={JSON.stringify(option.value)}
              className={classNames(
                "py-2 pl-3 pr-5 cursor-pointer",
                option.disabled
                  ? "text-slate-300"
                  : "text-slate-800 hover:bg-slate-200",
                option.selected
                  ? "bg-slate-100 font-semibold text-black"
                  : "font-light"
              )}
              onClick={(event) => {
                if (!option.disabled) {
                  onSelect(option.value, option, event);
                }
              }}
            >
              <span className="block text-md">{option.label}</span>
              {option.description == null ? null : (
                <span className="block text-xs opacity-70">
                  {option.description}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="grow shrink-0 basis-2" />
      </div>
      <div className="grow shrink-0 basis-2" />
    </div>
  );
  return (
    <>
      {dropdown && createPortal(dropdown, document.body)}
      {singleChild}
    </>
  );
}

export default DropdownMenu;

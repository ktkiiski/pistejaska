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
import DropdownList from "./DropdownList";
import DropdownListItem from "./DropdownListItem";

export interface DropdownMenuOption {
  label: ReactNode;
  description?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  value: unknown;
  onSelect?: (event: SyntheticEvent<HTMLLIElement>) => void;
}

interface DropdownMenuProps<Option> {
  options: Option[];
  isOpen: boolean;
  onSelect?: (option: Option, event: SyntheticEvent<HTMLLIElement>) => void;
  onClose: (event: SyntheticEvent) => void;
  children: ReactElement;
}

function DropdownMenu<Option extends DropdownMenuOption>({
  children,
  onClose,
  onSelect,
  options,
  isOpen,
}: DropdownMenuProps<Option>) {
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
      <div className="grow shrink-0 min-w-[0.5rem]" ref={leftRef} />
      <div className="grow-0 flex flex-col">
        <div className="grow shrink-0 min-h-[0.5rem]" ref={topRef} />
        <DropdownList ref={popoverRef}>
          {options.map((option) => (
            <DropdownListItem
              key={JSON.stringify(option.value)}
              label={option.label}
              description={option.description}
              disabled={option.disabled}
              selected={option.selected}
              onClick={(event) => {
                option.onSelect?.(event);
                onSelect?.(option, event);
              }}
            />
          ))}
        </DropdownList>
        <div className="grow-0 shrink-0 min-h-[0.5rem]" />
      </div>
      <div className="grow-0 shrink-0 min-w-[0.5rem]" />
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

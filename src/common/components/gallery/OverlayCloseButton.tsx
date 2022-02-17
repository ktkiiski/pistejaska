import classNames from "classnames";
import { forwardRef, HTMLAttributes } from "react";

const OverlayCloseButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={classNames(
      "w-8 h-8 pb-1 flex flex-col justify-center items-center text-center rounded-full bg-gray-700/70 hover:bg-gray-900/70 text-white font-bold cursor-pointer no-select",
      className
    )}
    {...props}
  >
    <span className="block text-3xl leading-4">&times;</span>
  </button>
));

export default OverlayCloseButton;

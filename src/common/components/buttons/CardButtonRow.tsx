import { HTMLAttributes } from "react";

const CardButtonRow: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`flex flex-row gap-2 justify-center flex-wrap ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </div>
);

export default CardButtonRow;

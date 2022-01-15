import React, { HTMLAttributes } from "react";

// TODO PANU: remove Tailwind prefix from names when material-ui has been refactored away

export const TailwindCard: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`container bg-gray-100 shadow rounded-xl mb-4 p-2 ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </div>
);

export const TailwindCardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`container mx-auto w-full bg-white rounded-lg shadow ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </div>
);

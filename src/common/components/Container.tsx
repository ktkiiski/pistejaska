import React from "react";
import { TailwindStyle } from "./types";

export const TailwindContainerTitle: React.FC = ({ children }) => (
  <p className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-2 p-2">
    {children}
  </p>
);

// TODO PANU: remove Tailwind prefix from names when material-ui has been refactored away

export const TailwindCard: React.FC<TailwindStyle> = ({
  children,
  className,
}) => (
  <div
    className={`container bg-gray-100 shadow rounded-xl mb-4 p-2 ${
      className || ""
    }`}
  >
    {children}
  </div>
);

export const TailwindCardContent: React.FC<TailwindStyle> = ({
  children,
  className,
}) => (
  <div
    className={`container mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow ${
      className || ""
    }`}
  >
    {children}
  </div>
);

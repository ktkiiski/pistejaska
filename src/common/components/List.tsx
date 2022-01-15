import React, { HTMLAttributes } from "react";
import CardContent from "./CardContent";

export const TailwindListItemText: React.FC<{
  title: string;
  description?: string;
}> = ({ title, description }) => (
  <div className="flex-1 pl-1 mr-8">
    <div className="font-medium">{title}</div>
    <div className="text-gray-600 text-sm">{description}</div>
  </div>
);

export const TailwindListItemIcon: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`flex flex-col justify-center items-center mr-4 ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </div>
);

export const TailwindListItemDescription: React.FC = ({ children }) => (
  <div className="text-gray-600 text-right text-xs whitespace-pre-line">
    {children}
  </div>
);

export const TailwindListItem: React.FC<HTMLAttributes<HTMLLIElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <li className="flex flex-row" {...props}>
      <div
        className={`select-none cursor-pointer flex flex-1 items-center px-4 py-2 hover:bg-gray-50 ${
          className || ""
        }`}
      >
        {children}
      </div>
    </li>
  );
};

export const TailwindList: React.FC<{
  className?: string;
  onClickShowAll?: () => void;
  showPagination?: boolean;
  showShowAll?: boolean;
}> = ({ children, onClickShowAll, showPagination, showShowAll, className }) => (
  <>
    <CardContent
      className={`flex flex-col mx-auto items-center justify-center ${
        className || ""
      }`}
    >
      <ul className="flex flex-col divide divide-y w-full">{children}</ul>
    </CardContent>
    {/* TODO PANU: use pagination */}
    {showPagination && (
      <div className="flex flex-col items-center mt-4 mb-2">
        <div className="flex text-gray-700">
          <div className="h-8 w-8 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-left w-4 h-4"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <div className="flex h-8 font-medium rounded-full bg-gray-200">
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              1
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              ...
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              3
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full bg-purple-600 text-white ">
              4
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              5
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              ...
            </div>
            <div className="w-8 flex justify-center items-center   cursor-pointer leading-5 transition duration-150 ease-in  rounded-full  ">
              15
            </div>
          </div>

          <div className="h-8 w-8 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-right w-4 h-4"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    )}

    {showShowAll && (
      <div className="text-gray-600 text-xs w-100 text-right">
        <div onClick={onClickShowAll} className="cursor-pointer">
          Show all
        </div>
      </div>
    )}
  </>
);

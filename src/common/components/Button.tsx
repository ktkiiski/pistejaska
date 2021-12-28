import React, { ButtonHTMLAttributes, HTMLAttributes } from "react";

const defaultButtonClasses = `inline-block px-4 py-3
text-sm font-semibold text-center
text-white uppercase transition
duration-200 ease-in-out
shadow-md
rounded-full
cursor-pointer`;

export const TailwindButtonBase: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, onClick, className, disabled, ...props }) => (
  <button
    className={`${defaultButtonClasses} ${className}
    `}
    onClick={disabled || !onClick ? () => {} : onClick}
    {...props}
  >
    {children}
  </button>
);

export const TailwindButtonPrimary: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
  <TailwindButtonBase
    {...props}
    className={`
bg-purple-700 hover:bg-purple-800 ${
      props.disabled ? "text-gray-400 bg-gray-300 hover:bg-gray-300" : ""
    } ${props.className || ""}`}
  >
    {props.children}
  </TailwindButtonBase>
);

export const TailwindButtonDanger: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
  <TailwindButtonBase
    {...props}
    className={`
    bg-red-600 hover:bg-red-700 ${
      props.disabled ? "text-gray-400 bg-gray-300 hover:bg-gray-300" : ""
    }  ${props.className || ""}`}
  >
    {props.children}
  </TailwindButtonBase>
);

export const TailwindButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
  <TailwindButtonBase
    {...props}
    className={`$
    bg-gray-500
    hover:bg-gray-600
    ${props.disabled ? "text-gray-400 bg-gray-300 hover:bg-gray-300" : ""}
    ${props.className || ""}`}
  >
    {props.children}
  </TailwindButtonBase>
);

export const TailwindCardButtonRow: React.FC<
  HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => (
  <div
    className={`flex flex-row gap-2 justify-center flex-wrap ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </div>
);

export const TailwindBackButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = ({ onClick }) => (
  <TailwindButton onClick={onClick} className="px-4 py-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
        clipRule="evenodd"
      />
    </svg>
  </TailwindButton>
);

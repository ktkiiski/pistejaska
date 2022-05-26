import React, { ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
}

export default function ButtonGroup({ children }: ButtonGroupProps) {
  return <div className="flex flex-row gap-px items-stretch">{children}</div>;
}

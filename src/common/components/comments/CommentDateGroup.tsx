import { FC } from "react";

interface CommentDateGroupProps {
  heading: string;
  children?: React.ReactNode;
  key?: string | number;
}

const CommentDateGroup: FC<CommentDateGroupProps> = ({ children, heading }) => {
  return (
    <>
      <div className="p-1 text-slate-400 text-xs text-center">{heading}</div>
      {children}
    </>
  );
};

export default CommentDateGroup;

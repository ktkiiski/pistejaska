import { Temporal } from "@js-temporal/polyfill";
import { FC } from "react";

interface CommentTimeGroupProps {
  date: Temporal.Instant;
}

const CommentTimeGroup: FC<CommentTimeGroupProps> = ({ children, date }) => {
  return (
    <>
      <div className="p-1 text-slate-400 text-xs text-center">
        {date.toLocaleString()}
      </div>
      {children}
    </>
  );
};

export default CommentTimeGroup;

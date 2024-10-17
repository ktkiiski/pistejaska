import classNames from "classnames";
import { FC } from "react";

interface CommentListContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const CommentListContainer: FC<CommentListContainerProps> = ({
  children,
  className,
}) => {
  return <div className={classNames("space-y-2", className)}>{children}</div>;
};

export default CommentListContainer;

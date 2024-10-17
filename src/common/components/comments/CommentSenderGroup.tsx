import { FC } from "react";

interface CommentSenderGroupProps {
  userPhotoURL: string | null | undefined;
  userDisplayName: string | undefined;
  children?: React.ReactNode;
}

const CommentSenderGroup: FC<CommentSenderGroupProps> = ({
  children,
  userPhotoURL,
  userDisplayName,
}) => (
  <div className="flex flex-row items-end">
    <div className="shrink-0 mr-2 mb-1">
      {userPhotoURL ? (
        <img
          alt={userDisplayName}
          src={userPhotoURL}
          className="rounded-full h-7 w-7"
        />
      ) : (
        <div className="rounded-full h-7 w-7 background-gray" />
      )}
    </div>
    <div className="flex flex-col items-start">
      <div className="text-slate-500 text-xs mb-1 ml-3">{userDisplayName}</div>
      <div className="flex flex-col items-start space-y-1">{children}</div>
    </div>
  </div>
);

export default CommentSenderGroup;

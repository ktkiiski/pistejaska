import { Temporal } from "@js-temporal/polyfill";
import { last } from "lodash";
import { Fragment } from "react";
import ReactTooltip from "react-tooltip";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import Message from "./common/components/messages/Message";
import MessageGroup from "./common/components/messages/MessageGroup";
import ViewContentLayout from "./common/components/ViewContentLayout";
import {
  convertToLocaleDateString,
  convertToLocaleTimeString,
} from "./common/dateUtils";
import { useComments } from "./common/hooks/useComments";
import { Comment } from "./domain/comment";

interface CommentGroup {
  date: Temporal.Instant;
  messageGroups: {
    userId: string;
    userPhotoURL?: string | null;
    userDisplayName?: string;
    comments: Comment[];
  }[];
}

function groupComments(comments: Comment[]): CommentGroup[] {
  const groups: CommentGroup[] = [];
  comments.forEach((comment) => {
    const { userId, userPhotoURL, userDisplayName, createdOn } = comment;
    let group = last(groups);
    if (
      !group ||
      createdOn.since(group.date, { largestUnit: "minute" }).minutes > 5
    ) {
      // Start a new group
      group = { date: createdOn, messageGroups: [] };
      groups.push(group);
    }
    let messageGroup = last(group.messageGroups);
    if (!messageGroup || messageGroup.userId !== userId) {
      // Start a new message group
      messageGroup = {
        userId,
        userPhotoURL,
        userDisplayName,
        comments: [],
      };
      group.messageGroups.push(messageGroup);
    }
    messageGroup.comments.push(comment);
  });
  return groups;
}

export const CommentList = (props: { playId: string }) => {
  const { playId } = props;
  const [comments, loading, error] = useComments(playId);

  if (error) {
    return (
      <ViewContentLayout>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </ViewContentLayout>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (comments.length === 0) {
    return (
      <div className="w-full text-center">
        No comments yet. Be the first one to comment! 😎
      </div>
    );
  }

  const groups = groupComments(comments);

  return (
    <div className="space-y-2 px-2">
      <ReactTooltip />
      {groups.map((group, groupIdx) => (
        <Fragment key={groupIdx}>
          <div className="p-1 text-slate-400 text-xs text-center">{`${convertToLocaleDateString(
            group.date
          )} ${convertToLocaleTimeString(group.date)}`}</div>
          {group.messageGroups.map(
            ({ userDisplayName, userPhotoURL, comments }, idx) => (
              <MessageGroup
                key={idx}
                userDisplayName={userDisplayName}
                userPhotoURL={userPhotoURL}
              >
                {comments.map((comment, messageIdx) => (
                  <Message date={comment.createdOn} key={messageIdx}>
                    {comment.comment}
                  </Message>
                ))}
              </MessageGroup>
            )
          )}
        </Fragment>
      ))}
    </div>
  );
};

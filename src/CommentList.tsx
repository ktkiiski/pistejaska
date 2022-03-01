import { Temporal } from "@js-temporal/polyfill";
import { last } from "lodash";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import CommentItem from "./common/components/comments/CommentItem";
import CommentSenderGroup from "./common/components/comments/CommentSenderGroup";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { useComments } from "./common/hooks/useComments";
import { Comment } from "./domain/comment";
import CommentListContainer from "./common/components/comments/CommentListContainer";
import CommentTimeGroup from "./common/components/comments/CommentTimeGroup";
import ReactTooltip from "react-tooltip";
import { deleteComment } from "./actions/deleteComment";
import useCurrentUser from "./common/hooks/useCurrentUser";

interface CommentGroup {
  date: Temporal.Instant;
  senderGroups: {
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
      group = { date: createdOn, senderGroups: [] };
      groups.push(group);
    }
    let senderGroup = last(group.senderGroups);
    if (!senderGroup || senderGroup.userId !== userId) {
      // Start a new message group
      senderGroup = {
        userId,
        userPhotoURL,
        userDisplayName,
        comments: [],
      };
      group.senderGroups.push(senderGroup);
    }
    senderGroup.comments.push(comment);
  });
  return groups;
}

export const CommentList = (props: { playId: string }) => {
  const [user] = useCurrentUser();
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
    <CommentListContainer className="mx-2">
      <ReactTooltip />
      {groups.map((group, groupIdx) => (
        <CommentTimeGroup key={groupIdx} date={group.date}>
          {group.senderGroups.map(
            ({ userDisplayName, userPhotoURL, comments }, idx) => (
              <CommentSenderGroup
                key={idx}
                userDisplayName={userDisplayName}
                userPhotoURL={userPhotoURL}
              >
                {comments.map((comment, messageIdx) => (
                  <CommentItem
                    date={comment.createdOn}
                    key={messageIdx}
                    onDelete={
                      comment.userId === user?.uid
                        ? () => {
                            deleteComment(comment.id);
                          }
                        : null
                    }
                  >
                    {comment.comment}
                  </CommentItem>
                ))}
              </CommentSenderGroup>
            )
          )}
        </CommentTimeGroup>
      ))}
    </CommentListContainer>
  );
};

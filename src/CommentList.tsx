import List from "./common/components/lists/List";
import ListItem from "./common/components/lists/ListItem";
import ListItemDescription from "./common/components/lists/ListItemDescription";
import ListItemIcon from "./common/components/lists/ListItemIcon";
import ListItemText from "./common/components/lists/ListItemText";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import Markdown from "./common/components/Markdown";
import ViewContentLayout from "./common/components/ViewContentLayout";
import {
  convertToLocaleDateString,
  convertToLocaleTimeString,
} from "./common/dateUtils";
import { useComments } from "./common/hooks/useComments";

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

  return (
    <>
      <List>
        {comments.map((comment) => {
          return (
            <ListItem key={comment.id}>
              <ListItemIcon>
                {comment.userPhotoURL ? (
                  <img
                    alt="gamepic"
                    src={comment.userPhotoURL}
                    className="mx-auto object-cover rounded-full h-14 w-14 "
                  />
                ) : (
                  <div className="mx-auto object-cover rounded-full h-14 w-14 background-gray" />
                )}
              </ListItemIcon>
              <ListItemText
                title={comment.userDisplayName ?? ""}
                description={<Markdown>{comment.comment}</Markdown>}
              />
              <ListItemDescription>
                {convertToLocaleDateString(comment.createdOn)}
                <br />
                {convertToLocaleTimeString(comment.createdOn)}
              </ListItemDescription>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

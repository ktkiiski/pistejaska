import { useState } from "react";

import { LoadingSpinner } from "./common/components/LoadingSpinner";
import InputTextField from "./common/components/inputs/InputTextField";
import ButtonPrimary from "./common/components/buttons/ButtonPrimary";
import { User } from "firebase/auth";
import { addComment } from "./common/hooks/useComments";
import { v4 as uuid } from "uuid";
import Heading3 from "./common/components/typography/Heading3";

export const CommentAdd = (props: { playId: string; user: User }) => {
  const { playId, user } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [comment, setComment] = useState("");

  const onSave = async () => {
    setIsSaving(true);
    const commentDto = {
      id: uuid(),
      playId: playId,
      comment: comment,
      userId: user.uid,
      createdOn: new Date().toISOString(),
    };
    await addComment(commentDto, user);
    setComment("");
    setIsSaving(false);
  };

  return (
    <>
      {isSaving ? <LoadingSpinner /> : null}
      {isSaving === false ? (
        <>
          <div className="flex w-full justify-center mt-4">
            <InputTextField
              className="w-60 max-w-full"
              label={"Comment"}
              value={comment ?? ""}
              onChange={(newValue) => setComment(newValue)}
            />
            <ButtonPrimary className="float-right" onClick={onSave}>
              Post
            </ButtonPrimary>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

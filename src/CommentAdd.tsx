import { FormEventHandler, useState } from "react";

import { LoadingSpinner } from "./common/components/LoadingSpinner";
import InputTextField from "./common/components/inputs/InputTextField";
import ButtonPrimary from "./common/components/buttons/ButtonPrimary";
import { User } from "firebase/auth";
import { v4 as uuid } from "uuid";
import { Temporal } from "@js-temporal/polyfill";
import { addComment } from "./actions/addComment";

export const CommentAdd = (props: { playId: string; user: User }) => {
  const { playId, user } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [comment, setComment] = useState("");

  const onSave: FormEventHandler = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const commentDto = {
      id: uuid(),
      playId: playId,
      comment: comment,
      userId: user.uid,
      createdOn: Temporal.Now.instant().toString({ fractionalSecondDigits: 3 }),
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
          <form
            className="flex flex-row w-full justify-center items-center mt-4"
            onSubmit={onSave}
          >
            <InputTextField
              className="w-60 max-w-full mb-2"
              label={"Comment"}
              value={comment ?? ""}
              onChange={(newValue) => setComment(newValue)}
            />
            <ButtonPrimary className="shrink-0 ml-1" type="submit">
              Send
            </ButtonPrimary>
          </form>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

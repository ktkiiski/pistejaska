import { useCollectionData } from "react-firebase-hooks/firestore";
import { app } from "../firebase";
import {
  getFirestore,
  collection,
  FirestoreDataConverter,
  doc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { addOrUpdateUser, useUsers } from "./useUsers";
import { sortBy } from "lodash";
import { Comment, CommentDTO } from "../../domain/comment";

const commentConverter: FirestoreDataConverter<CommentDTO> = {
  fromFirestore: (snapshot) => snapshot.data() as CommentDTO,
  toFirestore: (comment: CommentDTO) => comment,
};

export const useComments = (
  playId: string
): [Comment[], boolean, Error | undefined] => {
  const firestore = getFirestore(app);
  const allComments = collection(firestore, "comments-v1").withConverter(
    commentConverter
  );
  const q = query(allComments, where("playId", "==", playId));

  const [users, isLoading, isError] = useUsers();
  const [datas, loading, error] = useCollectionData(q);

  if (isLoading || isError) {
    return [[], true, isError];
  }

  return [
    loading || !datas
      ? []
      : sortBy(datas, (x) => x.createdOn).map((x) => new Comment(x, users)),
    loading,
    error,
  ];
};

export const addComment = async (comment: CommentDTO, user: User) => {
  const db = getFirestore(app);

  await addOrUpdateUser(db, user);
  await setDoc(doc(db, "comments-v1", comment.id), comment);
};

import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "../common/firebase";

export const deleteComment = async (commentId: string) => {
  const db = getFirestore(app);
  await deleteDoc(doc(db, "comments-v1", commentId));
};

import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "../common/firebase";

export default async function deleteGame(id: string) {
  if (!id) {
    throw new Error("Missing game ID");
  }

  const db = getFirestore(app);
  await deleteDoc(doc(db, "games", id));
}

import { PlayDTO } from "../domain/play";
import { db } from "../common/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { isEmpty } from "lodash-es";

export default async function updatePlay(
  playId: string,
  changes: Partial<PlayDTO>,
) {
  if (isEmpty(changes)) {
    // Nothing to actually save
    return;
  }
  // Update the play on Firestore
  await updateDoc(doc(db, "plays-v1", playId), changes);
}

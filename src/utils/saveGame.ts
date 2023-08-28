import { GameDefinition } from "../domain/game";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../common/firebase";

export default async function saveGame(game: GameDefinition) {
  const { id } = game ?? {};
  if (!id) {
    throw new Error("Missing game ID");
  }

  const db = getFirestore(app);
  await setDoc(doc(db, "games", id), game);
}

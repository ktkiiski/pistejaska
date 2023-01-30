import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { Play, PlayDTO } from "../../domain/play";
import { collection, FirestoreDataConverter } from "firebase/firestore";

export const playConverter: FirestoreDataConverter<Play> = {
  fromFirestore: (snapshot) => new Play(snapshot.data() as PlayDTO),
  toFirestore: (play: Play) => play.toDTO(),
};

export const playCollection = collection(db, "plays-v1").withConverter(
  playConverter
);

export const usePlays = (): [Play[], boolean, Error | undefined] => {
  const [plays, loading, error] = useCollectionData(playCollection);
  return [loading || !plays ? [] : plays, loading, error];
};

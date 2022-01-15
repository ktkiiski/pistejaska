import { useCollectionData } from "react-firebase-hooks/firestore";
import { app } from "../firebase";
import { Play, PlayDTO } from "../../domain/play";
import {
  getFirestore,
  collection,
  FirestoreDataConverter,
} from "firebase/firestore";

const playConverter: FirestoreDataConverter<Play> = {
  fromFirestore: (snapshot) => new Play(snapshot.data() as PlayDTO),
  toFirestore: (play: Play) => play.toDTO(),
};

const firestore = getFirestore(app);
const query = collection(firestore, "plays-v1").withConverter(playConverter);

export const usePlays = (): [Play[], boolean, Error | undefined] => {
  const [plays, loading, error] = useCollectionData(query);
  return [loading || !plays ? [] : plays, loading, error];
};

import { useCollectionData } from "react-firebase-hooks/firestore";
import { app } from "../firebase";
import { Game, GameDefinition } from "../../domain/game";
import {
  getFirestore,
  collection,
  FirestoreDataConverter,
} from "firebase/firestore";

const playConverter: FirestoreDataConverter<Game> = {
  fromFirestore: (snapshot) => new Game(snapshot.data() as GameDefinition),
  toFirestore: (play: Game) => play.toDTO(),
};

const firestore = getFirestore(app);
const query = collection(firestore, "games").withConverter(playConverter);

export const useGames = (): [Game[], boolean, Error | undefined] => {
  const [games, loading, error] = useCollectionData(query);
  return [loading || !games ? [] : games, loading, error];
};

import { firestore } from "firebase";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Game, GameDefinition } from "./game";

const gamesQuery = firestore().collection('games').orderBy('name');

export function useGames(): Game[] | undefined {
  const [gamesData] = useCollectionData<GameDefinition>(gamesQuery);
  const games = useMemo(() => gamesData?.map(game => new Game(game)), [gamesData]);
  return games;
}

import { useCollection } from "react-firebase-hooks/firestore";
import { app } from "../firebase";
import { Game } from "../../domain/game";
import { useMemo } from "react";
import { getFirestore, collection } from 'firebase/firestore';
import { orderBy } from "lodash";

export const useGames = (): [Game[], boolean, Error | undefined] => {

  const [value, loading, error] = useCollection(
    collection(getFirestore(app), 'games')
  );

  const plays = useMemo(
    () => (loading || !value ? [] : orderBy(value.docs.map((x: any) => x.data()), x => x.name).map((data) => new Game(data))),
    [value, loading]
  );
  return [plays, loading, error];
};
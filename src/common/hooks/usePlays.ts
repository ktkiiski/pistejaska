import { useCollectionData } from "react-firebase-hooks/firestore";
import * as firebase from "firebase";
import { Play, PlayDTO } from "../../domain/play";
import { useMemo } from "react";

export const usePlays = (): [Play[], boolean, Error | undefined] => {
  const [docs, loading, error] = useCollectionData<PlayDTO>(
    firebase.firestore().collection("plays-v1")
  );
  const plays = useMemo(
    () => (loading || !docs ? [] : docs.map((data) => new Play(data))),
    [docs, loading]
  );
  return [plays, loading, error];
};

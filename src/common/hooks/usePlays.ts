import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { Play, PlayDTO } from "../../domain/play";
import { useMemo } from "react";

const playsQuery = firestore().collection("plays-v1");

export const usePlays = (): [Play[], boolean, Error | undefined] => {
  const [docs, loading, error] = useCollectionData<PlayDTO>(playsQuery);
  const plays = useMemo(
    () => (loading || !docs ? [] : docs.map((data) => new Play(data))),
    [docs, loading]
  );
  return [plays, loading, error];
};

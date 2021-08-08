import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { Play, PlayDTO } from "../../domain/play";
import { useMemo } from "react";

const playQuery = firestore().collection("plays-v1");

export const usePlay = (
  playId: string
): [Play | null, boolean, Error | undefined] => {
  const [value, loading, error] = useCollection(playQuery);
  const doc = value && value.docs.find((d) => d.id === playId);
  const play = useMemo(() => (doc && new Play(doc.data() as PlayDTO)) || null, [
    doc,
  ]);
  return [play, loading, error];
};

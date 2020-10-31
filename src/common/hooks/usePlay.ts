import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase";
import { Play, PlayDTO } from "../../domain/play";
import { useMemo } from "react";

export const usePlay = (
  playId: string
): [Play | null, boolean, Error | undefined] => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("plays-v1")
  );
  const doc = value && value.docs.find((d) => d.id === playId);
  const play = useMemo(() => (doc && new Play(doc.data() as PlayDTO)) || null, [
    doc,
  ]);
  return [play, loading, error];
};

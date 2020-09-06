import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase";
import { Play } from "../../domain/play";

export const usePlays = (): [Play[], boolean, Error | undefined] => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("plays-v1")
  );

  const plays: Play[] = loading
    ? []
    : value?.docs?.map((d) => new Play(d.data() as any)) || [];

  return [plays, loading, error];
};

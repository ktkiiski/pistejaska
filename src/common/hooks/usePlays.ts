import { useCollection } from "react-firebase-hooks/firestore";
import { app } from "../firebase";
import { Play } from "../../domain/play";
import { useMemo } from "react";
import { getFirestore, collection } from 'firebase/firestore';

export const usePlays = (): [Play[], boolean, Error | undefined] => {

  const [value, loading, error] = useCollection(
    collection(getFirestore(app), 'plays-v1')
  );

  const plays = useMemo(
    () => (loading || !value ? [] : value.docs.map((doc: any) => new Play(doc.data()))),
    [value, loading]
  );
  return [plays, loading, error];
};

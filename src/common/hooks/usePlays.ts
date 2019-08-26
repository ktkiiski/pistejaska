import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase";

export const usePlays = () => {
  const args = useCollection(firebase.firestore().collection("plays-v1"));
  return args;
};

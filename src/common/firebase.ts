import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyDI_XDKW2vVftx7oUy1a_QTR5BE8j6S-Ds",
  authDomain: "pistejaska-dev.firebaseapp.com",
  databaseURL: "https://pistejaska-dev.firebaseio.com",
  projectId: "pistejaska-dev",
  storageBucket: "pistejaska-dev.appspot.com",
  messagingSenderId: "597805798706",
};
export const app = initializeApp(config);
export const db = getFirestore(app);

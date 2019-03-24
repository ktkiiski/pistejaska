import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

export const CurrentUser = () => {
  const { initialising, user } = useAuthState(firebase.auth());
  const login = () => {
    // TODO PANU: change to Google login
    firebase.auth().signInWithEmailAndPassword("test@test.com", "password");
  };
  const logout = () => {
    firebase.auth().signOut();
  };

  if (initialising) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return <button onClick={login}>Log in</button>;
};

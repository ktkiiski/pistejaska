import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from './common/firebase';
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

export const Login = () => {
  const center = {
    position: "absolute" as any,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const [user, loading] = useAuthState(firebase.auth());
  const login = async () => {
    // NOTE: could change implementation, this requires 3rd party cookies
    var provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithRedirect(provider);
    } catch (error) {
      alert(error);
    }

    return <div>Loading...</div>;
  };
  if (loading) {
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
        <Link to="/">Start using app</Link>
      </div>
    );
  }
  return (
    <>
      <Button
        style={center}
        onClick={login}
        variant="contained"
        color="primary"
      >
        Log in
      </Button>
      3rd party cookies must be enabled
    </>
  );
};

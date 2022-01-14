import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { LoadingSpinner } from "./common/components/LoadingSpinner";

export const Login = () => {
  const center = {
    position: "absolute" as any,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const login = async () => {
    // NOTE: could change implementation, this requires 3rd party cookies
    const provider = new GoogleAuthProvider();

    try {
      signInWithRedirect(auth, provider);
    } catch (error) {
      alert(error);
    }

    return <LoadingSpinner />;
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

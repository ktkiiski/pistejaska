import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import {
  CssBaseline,
  Paper,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Input,
  FormControlLabel,
  Checkbox,
  Button
} from "@material-ui/core";
import classes from "*.module.css";

export const Login = () => {
  const center = {
    position: "absolute" as any,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };
  const { initialising, user } = useAuthState(firebase.auth());
  const login = () => {
    // TODO PANU: change to Google login
    firebase.auth().signInWithEmailAndPassword("test@test.com", "password");
    return <div>Loading...</div>;
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
        <Link to="/">Start using app</Link>
      </div>
    );
  }
  return (
    <Button style={center} onClick={login} variant="contained" color="primary">
      Log in
    </Button>
  );
};

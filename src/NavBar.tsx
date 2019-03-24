import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button
} from "@material-ui/core";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { Login } from "./Login";
import { Link, RouteComponentProps } from "react-router-dom";
import firebase from "firebase";

const logout = () => {
  firebase.auth().signOut();
};
// TODO PANU: add profile pic from google

export function NavBar(props: RouteComponentProps<{}>) {
  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Button color="inherit" onClick={() => props.history.push("/")}>
            List
          </Button>

          <Button color="inherit" onClick={() => props.history.push("/new")}>
            New
          </Button>
          <Button color="inherit" onClick={() => props.history.push("/admin")}>
            Admin
          </Button>
          <Button color="inherit" onClick={() => logout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Grid
} from "@material-ui/core";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { Login } from "./Login";
import { Link, RouteComponentProps } from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/auth";

const logout = () => {
  firebase.auth().signOut();
};

export function NavBar(props: RouteComponentProps<{}>) {
  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Grid justify="space-between" container spacing={0}>
            <Grid item>
              {/* <IconButton color="inherit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z" />
                </svg>
              </IconButton>
              */}
              <Typography
                variant="h6"
                style={{ flexGrow: 1, fontSize: "1em", paddingTop: "5px" }}
                color="inherit"
              >
                Pistejaska
              </Typography>
            </Grid>
            <Grid item>
              <Button color="inherit" onClick={() => props.history.push("/")}>
                Plays
              </Button>
              <Button
                color="inherit"
                onClick={() => props.history.push("/new")}
              >
                New
              </Button>
              <Button
                color="inherit"
                onClick={() => props.history.push("/admin")}
              >
                Admin
              </Button>
              <Button color="inherit" onClick={() => logout()}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import firebase from "firebase";

const logout = () => {
  firebase.auth().signOut();
};

const useStyles = makeStyles(() => ({
  title: {
    textAlign: "left",
    flexGrow: 1,
    cursor: "pointer",
  },
}));

export function NavBar() {
  const history = useHistory();
  const styles = useStyles();
  const [
    menuAnchorElement,
    setMenuAnchorElement,
  ] = useState<HTMLElement | null>(null);
  const menuIcon = useMemo(
    () => (
      <IconButton
        aria-label="More options"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={(event) => {
          setMenuAnchorElement(event.currentTarget);
        }}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    ),
    []
  );
  const menu = useMemo(() => {
    const isMenuOpen = menuAnchorElement != null;
    const closeMenu = () => setMenuAnchorElement(null);
    return (
      <Menu
        id="menu-appbar"
        anchorEl={menuAnchorElement}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            history.push("/players");
            closeMenu();
          }}
        >
          Players
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push("/whatsnew");
            closeMenu();
          }}
        >
          Changelog
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            logout();
          }}
        >
          Log out
        </MenuItem>
      </Menu>
    );
  }, [menuAnchorElement, history]);
  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            className={styles.title}
            color="inherit"
            onClick={() => history.push("/")}
          >
            Pistejaska
          </Typography>
          <Button color="inherit" onClick={() => history.push("/")}>
            Plays
          </Button>
          <Button color="inherit" onClick={() => history.push("/new")}>
            New
          </Button>
          <Button color="inherit" onClick={() => history.push("/games")}>
            Games
          </Button>
          <div>
            {menuIcon}
            {menu}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

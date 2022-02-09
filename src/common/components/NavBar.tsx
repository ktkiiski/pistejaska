import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { getAuth, signOut } from "firebase/auth";
import DropdownMenu from "./dropdowns/DropdownMenu";

const logout = () => {
  signOut(getAuth());
};

export function NavBar() {
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const openMenu = useCallback(() => setIsDropdownOpen(true), []);
  const closeMenu = useCallback(() => setIsDropdownOpen(false), []);
  const menuOptions = useMemo(
    () => [
      {
        value: "players" as const,
        label: "Players",
        onSelect: () => {
          history.push("/players");
        },
      },
      {
        value: "changelog" as const,
        label: "Changelog",
        onSelect: () => {
          history.push("/whatsnew");
        },
      },
      {
        value: "logout" as const,
        label: "Log out",
        onSelect: () => {
          logout();
        },
      },
    ],
    [history]
  );
  const menuIcon = useMemo(
    () => (
      <IconButton
        aria-label="More options"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={openMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    ),
    [openMenu]
  );
  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            className="text-left grow cursor-pointer"
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
          <DropdownMenu
            isOpen={isDropdownOpen}
            options={menuOptions}
            onClose={closeMenu}
            onSelect={closeMenu}
          >
            {menuIcon}
          </DropdownMenu>
        </Toolbar>
      </AppBar>
    </div>
  );
}

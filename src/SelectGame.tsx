import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { RouteComponentProps } from "react-router";
import { TextField } from "@material-ui/core";
import { games } from "./domain/games";
import { GameDefinition } from "./domain/game";

export const SelectGame = (props: RouteComponentProps<{}>) => {
  const onSelectGame = (game: GameDefinition) =>
    props.history.push("/new/" + game.id);

  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <h2>Select game</h2>
      <TextField
        label="Search..."
        value={searchTerm}
        autoFocus
        onChange={e => setSearchTerm(e.currentTarget.value)}
      />
      <List component="nav">
        {games
          .filter(g => g.name.includes(searchTerm))
          .map(game => (
            <ListItem button onClick={() => onSelectGame(game)} key={game.id}>
              <ListItemIcon>
                <img width={30} height={30} src={game.icon} />
              </ListItemIcon>
              <ListItemText primary={game.name} />
            </ListItem>
          ))}
      </List>
    </div>
  );
};

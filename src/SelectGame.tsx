import React from "react";
import { games, GameDefinition } from "./domain/domain";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { RouteComponentProps } from "react-router";

export const SelectGame = (props: RouteComponentProps<{}>) => {
  const onSelectGame = (game: GameDefinition) =>
    props.history.push("/new/" + game.id);
  return (
    <div>
      <h2>Select game</h2>
      <List component="nav">
        {games.map(game => (
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

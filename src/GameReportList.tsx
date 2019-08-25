import React from "react";
import "firebase/firestore";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { games } from "./domain/games";
import { orderBy } from "lodash";
import { GameDefinition } from "./domain/game";

export const GameReportList = (props: RouteComponentProps<{}>) => {
  const onSelectGame = (game: GameDefinition) =>
    props.history.push("/reports/" + game.id);

  return (
    <div>
      <h3>Reports</h3>
      <List component="nav">
        {orderBy(games, g => g.name.toLowerCase()).map(game => (
          <ListItem button onClick={() => onSelectGame(game)} key={game.id}>
            <ListItemIcon>
              <img width={30} height={30} src={game.icon} alt={game.name} />
            </ListItemIcon>
            <ListItemText primary={game.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
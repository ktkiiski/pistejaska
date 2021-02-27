import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { orderBy } from "lodash";
import { GameDefinition } from "./domain/game";
import { useGames } from "./common/hooks/useGames";

export const ReportGameList = (props: RouteComponentProps<{}>) => {
  const games = useGames();
  const onSelectGame = (game: GameDefinition) =>
    props.history.push("/games/" + game.id);

  return (
    <div>
      <h2>Games</h2>
      <List component="nav">
        {orderBy(games, (g) => g.name.toLowerCase()).map((game) => (
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

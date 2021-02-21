import React from "react";
import "firebase/firestore";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { flatMap, groupBy, orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import { Player } from "./domain/play";

export const ReportPlayerList = (props: RouteComponentProps<{}>) => {
  const [plays, loading, error] = usePlays();

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }
  if (loading) {
    return <>Loading...</>;
  }

  const onSelectPlayer = (player: Player) =>
    props.history.push("/players/" + player.id);

  const players = groupBy(
    orderBy(
      flatMap(plays, (p) => p.players),
      (p) => p.name
    ),
    (p) => p.id
  );

  return (
    <div>
      <h2>Players</h2>
      <List component="nav">
        {Object.keys(players).map((playerId) => {
          const player = players[playerId][0];
          return (
            <ListItem
              button
              onClick={() => onSelectPlayer(player)}
              key={player.id}
            >
              <ListItemText primary={player.name} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

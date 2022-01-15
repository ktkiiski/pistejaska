import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { flatMap, groupBy, orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import { Player } from "./domain/play";
import ViewContentLayout from "./common/components/ViewContentLayout";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import Title from "./common/components/typography/Title";

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
    return <LoadingSpinner />;
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
    <ViewContentLayout>
      <Title>Players</Title>
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
    </ViewContentLayout>
  );
};

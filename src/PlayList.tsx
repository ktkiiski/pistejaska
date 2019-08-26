import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Play } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { games } from "./domain/games";
import { orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";

export const PlayList = (props: RouteComponentProps<{}>) => {
  const [value, loading, error] = usePlays();

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }

  const plays: Play[] = loading
    ? []
    : (value && value.docs.map(d => new Play(d.data() as any))) || [];

  const onSelectPlay = (play: Play) => props.history.push("/view/" + play.id);
  const getGame = (play: Play) =>
    games.find(g => g.id === play.gameId) || ({} as any);

  return (
    <div>
      <h3>Plays</h3>
      <List component="nav">
        {orderBy(plays, ["date", "created"], ["desc", "desc"]).map(play => (
          <ListItem button onClick={() => onSelectPlay(play)} key={play.id}>
            <ListItemIcon>
              <img
                width={30}
                height={30}
                src={getGame(play).icon}
                alt={getGame(play).name}
              />
            </ListItemIcon>
            <ListItemText
              primary={play.getName()}
              secondary={getGame(play).name}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Play } from "./domain/model";
import { RouteComponentProps } from "react-router";
import { games } from "./domain/games";

export const ListPlays = (props: RouteComponentProps<{}>) => {
  const { error, loading, value } = useCollection(
    firebase.firestore().collection("plays")
  );

  if (error)
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );

  const plays: Play[] = loading
    ? []
    : (value && value.docs.map(d => new Play(JSON.parse(d.data().data)))) || [];

  const onSelectPlay = (play: Play) => props.history.push("/show/" + play.id);
  const getGameIcon = (play: Play) =>
    (games.find(g => g.id === play.gameId) || ({} as any)).icon;

  return (
    <div>
      <h3>Plays</h3>
      <List component="nav">
        {plays.map(play => (
          <ListItem button onClick={() => onSelectPlay(play)} key={play.id}>
            <ListItemIcon>
              <img width={30} height={30} src={getGameIcon(play)} />
            </ListItemIcon>
            <ListItemText primary={play.getName()} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

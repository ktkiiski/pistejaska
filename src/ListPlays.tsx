import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Play } from "./domain/domain";
import { RouteComponentProps } from "react-router";

export const ListPlays = (props: RouteComponentProps<{}>) => {
  const { error, loading, value } = useCollection(
    firebase.firestore().collection("plays")
  );

  const plays: Play[] = loading
    ? []
    : (value && (value.docs.map(d => JSON.parse(d.data().data)) as Play[])) ||
      [];

  const onSelectPlay = (play: Play) => props.history.push("/show/" + play.id);

  return (
    <div>
      <h3>Plays</h3>
      <List component="nav">
        {plays.map(play => (
          <ListItem button onClick={() => onSelectPlay(play)} key={play.id}>
            <ListItemIcon>
              <img
                width={30}
                height={30}
                src={
                  "https://cf.geekdo-images.com/itemrep/img/Ng0wVwl4xSa-MeOpuMaq1f7EwDs=/fit-in/246x300/pic1974056.jpg"
                }
              />
            </ListItemIcon>
            <ListItemText primary={play.gameId} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

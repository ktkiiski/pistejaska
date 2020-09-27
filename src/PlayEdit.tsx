import { RouteComponentProps } from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";
import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Play, PlayDTO } from "./domain/play";
import { PlayForm } from "./PlayForm";
import { games } from "./domain/games";

export const PlayEdit = (props: RouteComponentProps<any>) => {
  const playId = props.match.params["playId"];

  const [value, loading] = useCollection(
    firebase.firestore().collection("plays-v1")
  );

  if (loading) return <>Loading...</>;

  const existing = value && value.docs.find((d) => d.id === playId);

  if (!existing) {
    return <>Play not found!</>;
  }
  const play = new Play(existing.data() as PlayDTO);
  const game = games.find((g) => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onSave = async (play: Play) => {
    const duration = play.getTimeInHoursSinceCreation();
    const tenMins = 10 / 60;
    const tenHours = 10;

    if (duration > tenMins && duration < tenHours) {
      const setDuration = window.confirm(
        "Looks like the play began " +
          duration +
          "h ago.\n\nDo you want to set the play length to be " +
          duration +
          " hours?"
      );
      if (setDuration) {
        play.setDurationInHours(duration);
      }
    }
    const db = firebase.firestore();
    await db.collection("plays-v1").doc(play.id).set(play.toDTO());
    props.history.push("/view/" + playId);
  };
  return <PlayForm game={game} play={play} onSave={(play) => onSave(play)} />;
};

import { RouteComponentProps } from "react-router";
import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Play } from "./domain/play";
import { PlayForm } from "./PlayForm";
import { games } from "./domain/games";
import { usePlay } from "./common/hooks/usePlay";

export const PlayEdit = (props: RouteComponentProps<any>) => {
  const playId = props.match.params["playId"];
  const [play, loading] = usePlay(playId);

  if (loading) return <>Loading...</>;

  if (!play) {
    return <>Play not found!</>;
  }
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

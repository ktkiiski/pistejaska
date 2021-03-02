import { RouteComponentProps } from "react-router";
import React from "react";
import { firestore } from './common/firebase';
import { Play } from "./domain/play";
import { PlayForm } from "./PlayForm";
import { useGames } from "./common/hooks/useGames";
import { usePlay } from "./common/hooks/usePlay";

export const PlayEdit = (props: RouteComponentProps<any>) => {
  const games = useGames();
  const playId = props.match.params["playId"];
  const [play, loading] = usePlay(playId);

  if (loading) return <>Loading...</>;

  if (!play) {
    return <>Play not found!</>;
  }
  const game = games?.find((g) => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onSave = async (play: Play) => {
    const currentDuration = play.getDurationInHours();
    const duration = play.getTimeInHoursSinceCreation();
    const tenMins = 10 / 60;
    const tenHours = 10;

    if (currentDuration == null && duration > tenMins && duration < tenHours) {
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
    const db = firestore();
    await db.collection("plays-v1").doc(play.id).set(play.toDTO());
    props.history.push("/view/" + playId);
  };
  return <PlayForm game={game} play={play} onSave={(play) => onSave(play)} />;
};

import { RouteComponentProps } from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";
import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Play } from "./domain/model";
import { PlayForm } from "./PlayForm";
import { games } from "./domain/games";

export const PlayEdit = (props: RouteComponentProps<any>) => {
  const playId = props.match.params["playId"];

  const { error, loading, value } = useCollection(
    firebase.firestore().collection("plays")
  );

  if (loading) return <>Loading...</>;

  const existing = value && value.docs.find(d => d.id === playId);

  if (!existing) {
    return <>Play not found!</>;
  }
  const play = new Play(JSON.parse(existing.data().data));
  const game = games.find(g => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onSave = async (play: Play) => {
    const db = firebase.firestore();
    await db
      .collection("plays")
      .doc(play.id)
      .set({ data: JSON.stringify(play) });
    props.history.push("/show/" + playId);
  };
  return <PlayForm game={game} play={play} onSave={play => onSave(play)} />;
};

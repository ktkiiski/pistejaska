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

  const { loading, value } = useCollection(
    firebase.firestore().collection("plays-v1")
  );

  if (loading) return <>Loading...</>;

  const existing = value && value.docs.find(d => d.id === playId);

  if (!existing) {
    return <>Play not found!</>;
  }
  const play = new Play(existing.data() as PlayDTO);
  const game = games.find(g => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onSave = async (play: Play) => {
    const db = firebase.firestore();
    await db
      .collection("plays-v1")
      .doc(play.id)
      .set(play.toDTO());
    props.history.push("/view/" + playId);
  };
  return <PlayForm game={game} play={play} onSave={play => onSave(play)} />;
};

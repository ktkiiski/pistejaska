import { RouteComponentProps } from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import firebase from "firebase";
import { Play, games } from "./domain/domain";
import { PlayForm } from "./PlayForm";

// TODO PANU: PlayFormContainer?
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
  const play = JSON.parse(existing.data().data);
  const game = games.find(g => g.id === play.gameId);
  if (!game) return <>Game not found!</>;
  return (
    <PlayForm
      game={game}
      play={play}
      onSave={playId => props.history.push("/show/" + playId)}
    />
  );
};

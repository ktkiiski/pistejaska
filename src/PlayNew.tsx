import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { Player, GameDefinition, Play } from "./domain/domain";
import { PlayForm } from "./PlayForm";
import uuid from "uuid";
import { Redirect } from "react-router";

// TODO PANU: PlayFormContainer?
export const PlayNew = (props: { game: GameDefinition; players: Player[] }) => {
  const { game, players } = props;

  const [playId, setPlayId] = useState(uuid());
  const [loading, setLoading] = useState(true);

  const play = {
    gameId: game.id,
    id: playId,
    players: players,
    date: new Date(),
    scores: []
  };

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("plays")
      .doc(playId)
      .set({
        data: JSON.stringify(play)
      });
    setLoading(false);
  }, [playId]);

  if (loading) return <>Loading...</>;

  return <Redirect to={"/edit/" + playId} />;
};

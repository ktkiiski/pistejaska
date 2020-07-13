import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Player, Play } from "./domain/play";
import { v4 as uuid } from "uuid";
import { Redirect } from "react-router";
import { GameDefinition, Game } from "./domain/game";

export const PlayNew = (props: { game: GameDefinition; players: Player[] }) => {
  const { game, players } = props;

  const [playId] = useState(game.id + "-" + uuid());
  const [loading, setLoading] = useState(true);

  const play = new Play({
    gameId: game.id,
    id: playId,
    players: players,
    expansions: [],
    scores: [],
    misc: Game.getDefaultMiscFieldValues(),
    created: new Date().toISOString(),
  });

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("plays-v1").doc(playId).set(play.toDTO());
    setLoading(false);
  }, [playId, play]);

  if (loading) return <>Loading...</>;

  return <Redirect to={"/edit/" + playId} />;
};

import React, { useState, useEffect } from "react";
import { Player, Play } from "./domain/play";
import { v4 as uuid } from "uuid";
import { Redirect } from "react-router";
import { GameDefinition, Game } from "./domain/game";
import { firestore } from "./common/firebase";

export const PlayNew = (props: { game: GameDefinition; players: Player[] }) => {
  const { game, players } = props;

  const [playId] = useState(game.id + "-" + uuid());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const play = new Play({
      gameId: game.id,
      id: playId,
      players: players,
      expansions: [],
      scores: [],
      misc: Game.getDefaultMiscFieldValues(),
      created: new Date().toISOString(),
    });

    const db = firestore();
    db.collection("plays-v1").doc(playId).set(play.toDTO());
    setLoading(false);
  }, [playId, game.id, players]);

  if (loading) return <>Loading...</>;

  return <Redirect to={"/edit/" + playId} />;
};

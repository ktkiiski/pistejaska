import React, { useState, useEffect } from "react";
import { Player, Play } from "./domain/play";
import { v4 as uuid } from "uuid";
import { Redirect } from "react-router";
import { GameDefinition, Game } from "./domain/game";
import { app } from "./common/firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";

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

    const update = async() => {
      const db = getFirestore(app)
      await setDoc(doc(db, "plays-v1", playId), play.toDTO())
    }
    update();

    setLoading(false);
  }, [playId, game.id, players]);

  if (loading) return <>Loading...</>;

  return <Redirect to={"/edit/" + playId} />;
};

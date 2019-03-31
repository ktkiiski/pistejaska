import { RouteComponentProps } from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";
import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Play, MiscDataDTO } from "./domain/play";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter
} from "@material-ui/core";
import { games } from "./domain/games";
import { GameDefinition, GameMiscFieldDefinition } from "./domain/game";

export const PlayView = (props: RouteComponentProps<any>) => {
  const playId = props.match.params["playId"];

  const { error, loading, value } = useCollection(
    firebase.firestore().collection("plays")
  );

  if (error) return <>Error: {error}</>;

  if (loading) return <>Loading...</>;

  const existing = value && value.docs.find(d => d.id === playId);

  if (!existing) {
    return <>Play not found!</>;
  }
  const play = new Play(JSON.parse(existing.data().data));
  const game = games.find(g => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onEditPlay = () => props.history.push("/edit/" + play.id);
  const onBack = () => props.history.push("/");

  const onDelete = async () => {
    const reallyDelete = await confirm(
      `Do you really want to delete play ${play.getName()}?`
    );
    if (!reallyDelete) return;
    const db = firebase.firestore();
    await db
      .collection("plays")
      .doc(playId)
      .delete();

    props.history.push("/");
  };

  const getFieldName = (misc: MiscDataDTO): string => {
    const field = game.getFields().find(f => f.field.id === misc.fieldId);
    if (!field) return "";
    if ((field.field as GameMiscFieldDefinition).valuePerPlayer === true) {
      const playerName = (
        play.players.find(p => p.id === misc.playerId) || ({} as any)
      ).name;
      return `${field.field.name} (${playerName}):`;
    }
    return field.field.name;
  };

  return (
    <div>
      <h3>Play</h3>
      <div>Played on {play.getDate().toLocaleDateString()}</div>
      {play.misc.map((misc, idx) => (
        <div key={idx}>
          {getFieldName(misc)}: {misc.data}
        </div>
      ))}
      <PlayTable game={game} play={play} />
      <br />
      <Button variant="contained" color="default" onClick={onBack}>
        &lt;
      </Button>
      &nbsp;
      <Button variant="contained" color="primary" onClick={onEditPlay}>
        Edit
      </Button>
      &nbsp;
      <Button variant="contained" color="secondary" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};

const PlayTable = (props: { game: GameDefinition; play: Play }) => {
  const { game, play } = props;
  return (
    <div style={{ width: "auto", overflowX: "scroll" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            {play.players.map(p => (
              <TableCell key={p.id}>
                {`${play.getPosition(p)}. ${p.name}`}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {game.scoreFields.map(p => (
            <TableRow key={p.id}>
              <TableCell scope="row">{p.name}</TableCell>
              {play.players.map(f => (
                <TableCell scope="row" key={f.id}>
                  {
                    (
                      play.scores.find(
                        s => s.fieldId === p.id && s.playerId == f.id
                      ) || ({} as any)
                    ).score
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            {play.players.map(f => (
              <TableCell key={f.id}>{play.getTotal(f)}</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

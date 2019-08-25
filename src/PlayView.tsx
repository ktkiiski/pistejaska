import { RouteComponentProps } from "react-router";
import { useCollection } from "react-firebase-hooks/firestore";
import React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Play, MiscDataDTO, PlayDTO } from "./domain/play";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  makeStyles,
  Paper
} from "@material-ui/core";
import { games } from "./domain/games";
import { GameDefinition, GameMiscFieldDefinition } from "./domain/game";

export const PlayView = (props: RouteComponentProps<any>) => {
  const playId = props.match.params["playId"];

  const { error, loading, value } = useCollection(
    firebase.firestore().collection("plays-v1")
  );

  if (error) return <>Error: {error}</>;

  if (loading) return <>Loading...</>;

  const existing = value && value.docs.find(d => d.id === playId);

  if (!existing) {
    return <>Play not found!</>;
  }
  const play = new Play(existing.data() as PlayDTO);
  const game = games.find(g => g.id === play.gameId);
  if (!game) return <>Game not found!</>;

  const onEditPlay = () => props.history.push("/edit/" + play.id);
  const onBack = () => props.history.push("/");

  const onDelete = async () => {
    const reallyDelete = await window.confirm(
      `Do you really want to delete play ${play.getName()}?`
    );
    if (!reallyDelete) return;
    const db = firebase.firestore();
    await db
      .collection("plays-v1")
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
      return `${field.field.name} (${playerName})`;
    }
    return field.field.name;
  };

  return (
    <div style={{ paddingBottom: "1em" }}>
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
      &nbsp;
      <Button
        variant="contained"
        onClick={() => props.history.push("/reports/" + game.id)}
      >
        Show reports
      </Button>
    </div>
  );
};

const PlayTable = (props: { game: GameDefinition; play: Play }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      width: "100%"
    },
    paper: {
      marginTop: theme.spacing(3),
      width: "100%",
      overflowX: "auto",
      marginBottom: theme.spacing(2),
      paddingLeft: "4px"
    },
    table: {
      maxWidth: "100%"
    },
    "@global": {
      ".MuiTableCell-root": {
        padding: "0",
        fontSize: "0.8em"
      }
    }
  }));

  const classes = useStyles();
  const highlightColor = "#f5f5f5";
  const { game, play } = props;
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              {play.players.map((p, idx) => (
                <TableCell
                  key={p.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? highlightColor : ""
                  }}
                >
                  {`${play.getPosition(p)}. ${p.name}`}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {game.scoreFields.map(p => (
              <TableRow key={p.id}>
                <TableCell scope="row">{p.name}</TableCell>
                {play.players.map((f, idx) => (
                  <TableCell
                    scope="row"
                    key={f.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? highlightColor : ""
                    }}
                  >
                    {
                      (
                        play.scores.find(
                          s => s.fieldId === p.id && s.playerId === f.id
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
              {play.players.map((f, idx) => (
                <TableCell
                  key={f.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? highlightColor : ""
                  }}
                >
                  {play.getTotal(f)}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </div>
  );
};

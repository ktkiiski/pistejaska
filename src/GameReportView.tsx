import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  makeStyles,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import { Play } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { games } from "./domain/games";
import { max, min, mean } from "lodash";

export const GameReportView = (props: RouteComponentProps<any>) => {
  const gameId = props.match.params["gameId"];

  const { error, loading, value } = useCollection(
    firebase.firestore().collection("plays-v1")
  );

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }
  if (loading) {
    return <>Loading...</>;
  }

  const plays: Play[] = loading
    ? []
    : (value &&
        value.docs
          .map(d => new Play(d.data() as any))
          .filter(p => p.gameId === gameId)) ||
      [];

  const game = games.find(g => g.id === gameId);

  if (!game) {
    return <>Error</>;
  }

  return (
    <div>
      <h3>Reports: {game.name}</h3>
      <p>Based on {plays.length} plays.</p>
      <ReportTable plays={plays} />
    </div>
  );
};

const ReportTable = (props: { plays: Play[] }) => {
  const { plays } = props;

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

  if (plays.length === 0) {
    return <>No plays</>;
  }

  const winnerScores = plays.map(p => p.getWinnerScores());

  const values = [
    { name: "Max winner score", value: max(winnerScores) },
    { name: "Average winner score", value: mean(winnerScores) },
    { name: "Min winner score", value: min(winnerScores) }
  ];

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell># of players</TableCell>
              {["Any"].map(p => (
                <TableCell key={p}>{p}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map(p => (
              <TableRow key={p.name}>
                <TableCell scope="row">{p.name}</TableCell>
                <TableCell scope="row">{p.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

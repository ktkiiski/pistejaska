import React from "react";
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
import { usePlays } from "./common/hooks/usePlays";
import { calculateEloForPlayers } from "./domain/elo";

export const GameReportView = (props: RouteComponentProps<any>) => {
  const gameId = props.match.params["gameId"];

  const [plays, loading, error] = usePlays();

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

  const gamePlays = plays.filter(p => p.gameId === gameId);

  const game = games.find(g => g.id === gameId);

  if (!game) {
    return <>Error</>;
  }

  return (
    <div>
      <h3>Reports: {game.name}</h3>
      <p>Based on {gamePlays.length} plays.</p>
      <ReportTable plays={gamePlays} />

      <h4>Best players</h4>
      <ReportPlayers plays={gamePlays}></ReportPlayers>

      <p>
        Calculated with{" "}
        <a href="http://www.tckerrigan.com/Misc/Multiplayer_Elo/">SME</a>.
      </p>
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

const ReportPlayers = (props: { plays: Play[] }) => {
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

  const elo = calculateEloForPlayers(plays);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>ELO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elo.slice(0, 5).map(p => (
              <TableRow key={p.name}>
                <TableCell scope="row">{p.name}</TableCell>
                <TableCell scope="row">{p.elo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

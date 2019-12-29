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
import { max, min, mean, groupBy, union } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import { calculateEloForPlayers } from "./domain/ratings";

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
        <a href="https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/">
          TrueSkill
        </a>
        .
      </p>
    </div>
  );
};

const useReportTableStyles = makeStyles(theme => ({
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

const ReportTable = (props: { plays: Play[] }) => {
  const { plays } = props;

  const classes = useReportTableStyles();

  if (plays.length === 0) {
    return <>No plays</>;
  }

  const playsByNumberOfPlayers = groupBy(plays, p => p.players.length);

  // TODO: should refactor this hacky hack
  const numberOfPlayers = union(["Any"], Object.keys(playsByNumberOfPlayers));
  let report: any = {};
  numberOfPlayers.map(p => {
    const plays2 = p === "Any" ? plays : playsByNumberOfPlayers[p];

    const winnerScores = plays2.map(p => p.getWinnerScores());

    const values = [
      { name: "Max winner score", value: Math.round(max(winnerScores) || 0) },
      {
        name: "Average winner score",
        value: Math.round(mean(winnerScores) || 0)
      },
      { name: "Min winner score", value: Math.round(min(winnerScores) || 0) }
    ];

    report[p] = values;
    return values;
  });

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell># of players</TableCell>
              {numberOfPlayers.map(p => (
                <TableCell key={p}>{p}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key="max">
              <TableCell scope="row">Max winner score</TableCell>
              {numberOfPlayers.map(numOfPlayers => (
                <TableCell scope="row">
                  {report[numOfPlayers][0].value}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key="average">
              <TableCell scope="row">Average winner score</TableCell>
              {numberOfPlayers.map(numOfPlayers => (
                <TableCell scope="row">
                  {report[numOfPlayers][1].value}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key="min">
              <TableCell scope="row">Min winner score</TableCell>
              {numberOfPlayers.map(numOfPlayers => (
                <TableCell scope="row">
                  {report[numOfPlayers][2].value}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

const useReportPlayersStyles = makeStyles(theme => ({
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

const ReportPlayers = (props: { plays: Play[] }) => {
  const { plays } = props;

  const classes = useReportPlayersStyles();

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
              <TableCell>Trueskill</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elo.slice(0, 3).map(p => (
              <TableRow key={p.name}>
                <TableCell scope="row">{p.name}</TableCell>
                <TableCell scope="row">
                  {Math.round(p.rating.mu)} (± {Math.round(3 * p.rating.sigma)})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

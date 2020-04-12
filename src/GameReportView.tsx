import React from "react";
import {
  makeStyles,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { Play } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { games } from "./domain/games";
import { mean, groupBy, union, sortBy, last, first } from "lodash";
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

  const gamePlays = plays.filter((p) => p.gameId === gameId);

  const game = games.find((g) => g.id === gameId);

  if (!game) {
    return <>Error</>;
  }

  return (
    <div>
      <h3>Reports: {game.name}</h3>
      <p>Based on {gamePlays.length} plays.</p>
      <HighScoresReportTable plays={gamePlays} />

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

const useReportTableStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    paddingLeft: "4px",
  },
  table: {
    maxWidth: "100%",
  },
  "@global": {
    ".MuiTableCell-root": {
      padding: "0",
      fontSize: "0.8em",
    },
  },
}));

const HighScoresReportTable = (props: { plays: Play[] }) => {
  const { plays } = props;

  const playsByNumberOfPlayers = groupBy(plays, (p) => p.players.length);

  const columns = union(
    ["# of players", "Any"],
    Object.keys(playsByNumberOfPlayers)
  );

  let rows: any = [];
  columns.map((p, idx) => {
    if (idx === 0) {
      rows[0] = [];
      rows[0][0] = "Max winner score";
      rows[1] = [];
      rows[1][0] = "Average winner score";
      rows[2] = [];
      rows[2][0] = "Min winner score";
      return null;
    }
    const playsOfNumberOfPlayers =
      p === "Any" ? plays : playsByNumberOfPlayers[p];
    const playsOrderedByWinnerScore = sortBy(
      playsOfNumberOfPlayers,
      (x) => x.getWinnerScores() || 0
    );
    const maxScores = last(playsOrderedByWinnerScore);
    const minScores = first(playsOrderedByWinnerScore);

    const winnerScores = playsOfNumberOfPlayers.map((p) => p.getWinnerScores());

    rows[0][idx] = {
      value: Math.round(maxScores?.getWinnerScores() || 0),
      link: `/view/${maxScores?.id}`,
    };

    rows[1][idx] = {
      value: Math.round(mean(winnerScores) || 0),
    };

    rows[2][idx] = {
      value: Math.round(minScores?.getWinnerScores() || 0),
      link: `/view/${minScores?.id}`,
    };

    return null;
  });

  if (plays.length === 0) {
    rows = [];
  }

  return <ReportTable rows={rows} columns={columns}></ReportTable>;
};

type ReportTableProps = {
  rows: any[][];
  columns: string[];
};
const ReportTable = ({ rows, columns }: ReportTableProps) => {
  const classes = useReportTableStyles();

  if (rows.length === 0) {
    return <>No plays</>;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow key={row[0]}>
                {columns.map((column, columnIdx) => (
                  <TableCell scope="row" key={column}>
                    <a href={row[columnIdx]?.link}>{row[columnIdx]?.value}</a>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

const useReportPlayersStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    paddingLeft: "4px",
  },
  table: {
    maxWidth: "100%",
  },
  "@global": {
    ".MuiTableCell-root": {
      padding: "0",
      fontSize: "0.8em",
    },
  },
}));

const ReportPlayers = (props: { plays: Play[] }) => {
  const { plays } = props;

  const classes = useReportPlayersStyles();

  if (plays.length === 0) {
    return <>No plays</>;
  }

  const elo = calculateEloForPlayers(plays, 3);

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
            {elo.slice(0, 5).map((p) => (
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

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
import { GameMiscFieldDefinition, GameFieldOption } from "./domain/game";

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

  const reportDimensions = game.miscFields?.filter(
    (x) => x.isRelevantReportDimension === true
  );

  return (
    <div>
      <h3>Reports: {game.name}</h3>
      <p>Based on {gamePlays.length} plays.</p>
      <HighScoresReportTable plays={gamePlays} />

      {reportDimensions?.map((x) => {
        const playsWithDimension = gamePlays.filter((p) =>
          p.misc.some((m) => m.fieldId === x.id)
        );
        return (
          <>
            <h4>{x.name}</h4>
            <p>Based on {playsWithDimension.length} plays.</p>
            <DimensionReportTable plays={playsWithDimension} dimension={x} />
          </>
        );
      })}

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

const DimensionReportTable = (props: {
  plays: Play[];
  dimension: GameMiscFieldDefinition;
}) => {
  const { plays, dimension } = props;

  const columns = union([
    dimension.name,
    "Win percentage",
    "Use percentage",
    "TODO: Average position",
  ]);

  const rows: GameFieldOption<string>[] =
    (dimension as any).options?.map((x: any) => x) || [];

  const allPlays = plays.length;

  const reportRows = rows.map((row) => {
    const playsWhereValueWasUsed = plays.filter((p) =>
      p.misc.find((x) => x.fieldId === dimension.id && x.data === row.value)
    ).length;

    const playsWhereWinnerUsedValue = plays.filter(
      (p) => p.getWinnersDimensionValue(dimension) === row.value
    ).length;

    return [
      { value: row.label },
      {
        value: Math.round(
          (playsWhereWinnerUsedValue / playsWhereValueWasUsed) * 100 || 0
        ),
      },
      {
        value: Math.round((playsWhereValueWasUsed / allPlays) * 100),
      },
    ];
  });

  const sortedReportRows = sortBy(reportRows, (x) => x[1].value).reverse();

  const beautifiedReportRows = sortedReportRows.map((x) =>
    x.map((y, idx) =>
      idx === 0 ? { value: y.value.toString() } : { value: y.value + " %" }
    )
  );

  return (
    <ReportTable rows={beautifiedReportRows} columns={columns}></ReportTable>
  );
};
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
      rows[0][0] = { value: "Max winner score" };
      rows[1] = [];
      rows[1][0] = { value: "Average winner score" };
      rows[2] = [];
      rows[2][0] = { value: "Min winner score" };
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
  rows: ReportTableRow[][];
  columns: string[];
};
type ReportTableRow = {
  value: string;
  link?: string;
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
            {rows.map((row) => (
              <TableRow key={row[0].value}>
                {columns.map((column, columnIdx) => (
                  <TableCell scope="row" key={row[0].value + column}>
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

import React from "react";
import ReactTooltip from "react-tooltip";

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
import { GameMiscFieldDefinition } from "./domain/game";
import { getDimensionStatistics } from "./domain/statistics";

function isRelevantReportField(
  field: GameMiscFieldDefinition
): field is GameMiscFieldDefinition<string> {
  return (field.isRelevantReportDimension ?? false) && field.type !== "number";
}

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

  const reportDimensions = game.miscFields?.filter(isRelevantReportField);

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
          <React.Fragment key={x.id}>
            <h4>{x.name}</h4>
            <p>Based on {playsWithDimension.length} plays.</p>
            <DimensionReportTable plays={playsWithDimension} dimension={x} />
          </React.Fragment>
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
  dimension: GameMiscFieldDefinition<string>;
}) => {
  const { plays, dimension } = props;

  const columns = [
    { name: dimension.name },
    { name: "Win percentage" },
    { name: "Use percentage" },
    {
      name: "Average normalized rank",
      tooltip:
        '100% = only wins, 0% = only losses, 50% =  "middle" position (e.g. 2nd in 3-player play)',
    },
  ];

  const rows = sortBy(
    getDimensionStatistics(plays, dimension),
    (stat) => stat.averageNormalizedPosition ?? Number.POSITIVE_INFINITY
  );
  const playCount = plays.length;

  const reportRows = rows.map((row) => {
    return [
      { value: row.option.label },
      { value: Math.round((row.winCount / row.count) * 100) },
      { value: Math.round((row.count / playCount) * 100) },
      {
        value:
          row.averageNormalizedPosition == null
            ? null
            : Math.round(100 - row.averageNormalizedPosition * 100),
      },
    ];
  });

  const beautifiedReportRows = reportRows.map((x) =>
    x.map((y) => {
      if (typeof y.value === "string") {
        return { value: y.value };
      }
      if (y.value == null || Number.isNaN(y.value)) {
        return { value: "—" };
      }
      return { value: `${y.value} %` };
    })
  );

  return (
    <ReportTable rows={beautifiedReportRows} columns={columns}></ReportTable>
  );
};
const HighScoresReportTable = (props: { plays: Play[] }) => {
  const { plays } = props;

  const playsByNumberOfPlayers = groupBy(plays, (p) => p.players.length);

  const columns = union(
    [{ name: "# of players" }, { name: "Any" }],
    Object.keys(playsByNumberOfPlayers).map((x) => {
      return { name: x };
    })
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
      p.name === "Any" ? plays : playsByNumberOfPlayers[p.name];
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
  columns: { name: string; tooltip?: string }[];
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
      <ReactTooltip />
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.name}>
                  {c.name}
                  {c.tooltip ? (
                    <span
                      style={{
                        borderRadius: "10px",
                        padding: "0 5px",
                        backgroundColor: "#ccc",
                        color: "#fff",
                        marginLeft: "5px",
                      }}
                      data-tip={c.tooltip}
                    >
                      ?
                    </span>
                  ) : (
                    <></>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row[0].value}>
                {columns.map((column, columnIdx) => (
                  <TableCell scope="row" key={`${row[0].value}:${column.name}`}>
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

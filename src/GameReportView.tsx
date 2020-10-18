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
import { sortBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import { calculateEloForPlayers } from "./domain/ratings";
import { GameMiscFieldDefinition, Game } from "./domain/game";
import { getDimensionStatistics, getGameStatistics } from "./domain/statistics";
import GameScoreFieldReport from "./GameScoreFieldReport";
import ReportTable from "./ReportTable";
import GameCorrelationReport from "./GameCorrelationReport";

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
      <h2>Reports: {game.name}</h2>
      <p>Based on {gamePlays.length} plays.</p>
      <HighScoresReportTable game={game} plays={gamePlays} />

      <GameScoreFieldReport game={game} plays={gamePlays} />
      <GameCorrelationReport game={game} plays={gamePlays} />

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

function renderPercentage(count: number, max: number) {
  const percentage = Math.round((count / max) * 100);
  if (Number.isNaN(percentage) || !Number.isFinite(percentage)) {
    return "–";
  }
  return `${percentage}% (${count})`;
}

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

  const stats = Array.from(getDimensionStatistics(plays, dimension).values());
  const rows = sortBy(
    stats,
    (stat) => stat.averageNormalizedPosition ?? Number.POSITIVE_INFINITY,
    (stat) => -stat.count
  );
  const playCount = plays.length;

  const reportRows = rows.map((row) => {
    return [
      { value: row.option.label },
      { value: renderPercentage(row.winCount, row.count) },
      { value: renderPercentage(row.count, playCount) },
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

const stringifyScore = (score: number | null) =>
  score == null ? "—" : String(Math.round(score));

const HighScoresReportTable = (props: { game: Game; plays: Play[] }) => {
  const { game, plays } = props;

  const statsByPlayerCount = getGameStatistics(game, plays);
  const columns = [
    { name: "# of players" },
    ...statsByPlayerCount.map((s) => ({
      name: s.playerCount == null ? "Any" : String(s.playerCount),
    })),
  ];
  const rows = [
    [
      { value: "Max winning score" },
      ...statsByPlayerCount.map((s) => ({
        value: stringifyScore(s.maxWinningScore),
        link: s.maxWinningScorePlay
          ? `/view/${s.maxWinningScorePlay.id}`
          : undefined,
      })),
    ],
    [
      { value: "Average winning score" },
      ...statsByPlayerCount.map((s) => ({
        value: stringifyScore(s.averageWinningScore),
      })),
    ],
    [
      { value: "Min winning score" },
      ...statsByPlayerCount.map((s) => ({
        value: stringifyScore(s.minWinningScore),
        link: s.minWinningScorePlay
          ? `/view/${s.minWinningScorePlay.id}`
          : undefined,
      })),
    ],
    [
      { value: "Average duration" },
      ...statsByPlayerCount.map((s) => ({
        value:
          s.playerCount == null
            ? s.averageDurationPerPlayer == null
              ? "—"
              : `${s.averageDurationPerPlayer.toFixed(1)}h / 👤`
            : s.averageDuration == null
            ? "—"
            : `${s.averageDuration.toFixed(1)}h`,
      })),
    ],
  ];

  return <ReportTable rows={rows} columns={columns}></ReportTable>;
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

const bestPlayerCount = 5;

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
              <TableCell>Plays</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elo.slice(0, bestPlayerCount).map((player) => {
              const { id, name, rating, playCount } = player;
              return (
                <TableRow key={id}>
                  <TableCell scope="row">{name}</TableCell>
                  <TableCell scope="row">
                    {Math.round(rating.mu)} (± {Math.round(3 * rating.sigma)})
                  </TableCell>
                  <TableCell scope="row">{playCount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

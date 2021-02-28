import React, { useState } from "react";

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
import { usePlays } from "./common/hooks/usePlays";
import { calculateEloForPlayers } from "./domain/ratings";
import { GameMiscFieldDefinition, Game } from "./domain/game";
import { getGameStatistics } from "./domain/statistics";
import GameScoreFieldReport from "./ReportGameScoreField";
import ReportTable from "./ReportTable";
import ReportGameCorrelation from "./ReportGameCorrelation";
import { stringifyScore } from "./common/stringUtils";
import { Link } from "react-router-dom";
import { useGames } from "./common/hooks/useGames";
import ReportDimensionReportTable from "./ReportDimensionReportTable";
import ReportFilterSelector from "./ReportFilterSelector";
import { applyPlayFilters, ReportFilters } from "./domain/filters";

function isRelevantReportField(
  field: GameMiscFieldDefinition
): field is GameMiscFieldDefinition<string> {
  return (field.isRelevantReportDimension ?? false) && field.type !== "number";
}

export const ReportGameView = (props: RouteComponentProps<any>) => {
  const games = useGames();
  const gameId = props.match.params["gameId"];

  const [allPlays, loading, error] = usePlays();
  const [filters, setFilters] = useState<ReportFilters>({
    expansions: [],
    playerCount: null,
  });

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

  const unfilteredGamePlays = allPlays.filter((p) => p.gameId === gameId);
  const gamePlays = applyPlayFilters(unfilteredGamePlays, filters);

  const game = games?.find((g) => g.id === gameId);

  if (!game) {
    return <>Error</>;
  }

  const reportDimensions = game.miscFields?.filter(isRelevantReportField);

  return (
    <div>
      <h2>Reports: {game.name}</h2>
      <ReportFilterSelector
        plays={unfilteredGamePlays}
        filters={filters}
        onChange={setFilters}
        expansions={game.expansions}
      />
      <p>Based on {gamePlays.length < unfilteredGamePlays.length ? `${gamePlays.length} / ${unfilteredGamePlays.length}` : gamePlays.length} plays.</p>
      <HighScoresReportTable game={game} plays={gamePlays} />

      <GameScoreFieldReport game={game} plays={gamePlays} />
      <ReportGameCorrelation game={game} plays={gamePlays} />

      {reportDimensions?.map((x) => {
        const playsWithDimension = gamePlays.filter((p) =>
          p.misc.some((m) => m.fieldId === x.id)
        );
        return (
          <React.Fragment key={x.id}>
            <h4>{x.name}</h4>
            <p>Based on {playsWithDimension.length} plays.</p>
            <ReportDimensionReportTable plays={playsWithDimension} dimension={x} />
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
              <TableCell>Wins</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elo.slice(0, bestPlayerCount).map((player) => {
              const { id, name, rating, playCount, winCount } = player;
              return (
                <TableRow key={id}>
                  <TableCell scope="row"><Link to={`/players/${id}`}>{name}</Link></TableCell>
                  <TableCell scope="row">
                    {Math.round(rating.mu)} (± {Math.round(3 * rating.sigma)})
                  </TableCell>
                  <TableCell scope="row">{playCount}</TableCell>
                  <TableCell scope="row">
                    {Math.round((100 * winCount) / playCount)}% ({winCount})
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

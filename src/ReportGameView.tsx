import React, { useState } from "react";
import { Play } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { usePlays } from "./common/hooks/usePlays";
import { calculateEloForPlayers } from "./domain/ratings";
import { Game, GameMiscFieldDefinition } from "./domain/game";
import { getGameStatistics } from "./domain/statistics";
import GameScoreFieldReport from "./ReportGameScoreField";
import ReportTable from "./ReportTable";
import ReportGameCorrelation from "./ReportGameCorrelation";
import { stringifyScore } from "./common/stringUtils";
import { useGames } from "./common/hooks/useGames";
import ReportDimensionReportTable from "./ReportDimensionReportTable";
import ReportFilterSelector from "./ReportFilterSelector";
import {
  applyPlayFilters,
  emptyFilters,
  hasFilters,
  ReportFilters,
} from "./domain/filters";
import ViewContentLayout from "./common/components/ViewContentLayout";
import PlayList from "./PlayList";
import { useHistory } from "react-router-dom";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import CardButtonRow from "./common/components/buttons/CardButtonRow";
import ButtonPrimary from "./common/components/buttons/ButtonPrimary";
import Heading1 from "./common/components/typography/Heading1";
import Heading2 from "./common/components/typography/Heading2";

export const ReportGameView = (props: RouteComponentProps<any>) => {
  const history = useHistory();
  const [games] = useGames();
  const gameId = props.match.params["gameId"];

  const [allPlays, loading, error] = usePlays();
  const [filters, setFilters] = useState<ReportFilters>(emptyFilters);

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }
  if (loading) {
    return <LoadingSpinner />;
  }

  const unfilteredGamePlays = allPlays.filter((p) => p.gameId === gameId);
  const gamePlays = applyPlayFilters(unfilteredGamePlays, filters);

  const game = games?.find((g) => g.id === gameId);

  if (!game) {
    return <>Error</>;
  }

  const reportDimensions = game.getRelevantReportFields();

  return (
    <ViewContentLayout
      footer={
        <CardButtonRow>
          <ButtonPrimary
            onClick={() => {
              history.push(`/new/${gameId}`);
            }}
          >
            Start play
          </ButtonPrimary>
        </CardButtonRow>
      }
    >
      <Heading1>Reports: {game.name}</Heading1>

      <ReportFilterSelector
        game={game}
        plays={unfilteredGamePlays}
        filters={filters}
        onChange={setFilters}
      />
      <p>
        Based on{" "}
        {hasFilters(filters)
          ? `${gamePlays.length} / ${unfilteredGamePlays.length}`
          : gamePlays.length}{" "}
        plays.
      </p>
      <div className="space-y-3">
        <HighScoresReportTable game={game} plays={gamePlays} />
        <GameScoreFieldReport game={game} plays={gamePlays} />
        <ReportGameCorrelation game={game} plays={gamePlays} />
      </div>

      {reportDimensions.map((x) => {
        const playsWithDimension = gamePlays.filter((p) =>
          p.misc.some((m) => m.fieldId === x.id)
        );
        return (
          <React.Fragment key={x.id}>
            <Heading2>{x.name}</Heading2>
            <p>Based on {playsWithDimension.length} plays.</p>
            <ReportDimensionReportTable
              plays={playsWithDimension}
              dimension={x}
            />
          </React.Fragment>
        );
      })}

      <Heading2>Best players</Heading2>
      <ReportPlayers plays={gamePlays}></ReportPlayers>

      <p>
        Calculated with{" "}
        <a href="https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/">
          TrueSkill
        </a>
        .
      </p>

      <Heading2>Plays</Heading2>
      <PlayList games={games} plays={gamePlays} />
    </ViewContentLayout>
  );
};

const HighScoresReportTable = (props: { game: Game; plays: Play[] }) => {
  const { game, plays } = props;

  const otherDimensions = (game.miscFields ?? []).filter(
    (field) =>
      field.type === "number" &&
      !field.valuePerPlayer &&
      field.isRelevantReportDimension
  ) as GameMiscFieldDefinition<number>[];

  const statsByPlayerCount = getGameStatistics(game, plays, otherDimensions);
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
    ...otherDimensions.flatMap((field) => [
      [
        { value: `Maximum ${field.name}` },
        ...statsByPlayerCount.map((s) => ({
          value: s.dimensions[field.id]?.maxValue?.toString() ?? "-",
        })),
      ],
      [
        { value: `Average ${field.name}` },
        ...statsByPlayerCount.map((s) => ({
          value: s.dimensions[field.id]?.averageValue?.toFixed(1) ?? "-",
        })),
      ],
      [
        { value: `Minimum ${field.name}` },
        ...statsByPlayerCount.map((s) => ({
          value: s.dimensions[field.id]?.minValue?.toString() ?? "-",
        })),
      ],
    ]),
  ];

  return <ReportTable rows={rows} columns={columns}></ReportTable>;
};

const bestPlayerCount = 5;

const playerReportTableColumns = [
  { name: "Name" },
  { name: "Trueskill" },
  { name: "Plays" },
  { name: "Wins" },
];

const ReportPlayers = (props: { plays: Play[] }) => {
  const { plays } = props;

  if (plays.length === 0) {
    return <>No plays</>;
  }

  const elo = calculateEloForPlayers(plays, 3);

  return (
    <ReportTable
      columns={playerReportTableColumns}
      rows={elo.slice(0, bestPlayerCount).map((player) => {
        const { id, name, rating, playCount, winCount } = player;
        return [
          {
            value: name,
            link: `/players/${id}`,
          },
          {
            value: `${Math.round(rating.mu)} (± ${Math.round(
              3 * rating.sigma
            )})`,
          },
          {
            value: String(playCount),
          },
          {
            value: `${Math.round((100 * winCount) / playCount)}% (${winCount})`,
          },
        ];
      })}
    />
  );
};

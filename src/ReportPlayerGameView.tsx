import { usePlays } from "./common/hooks/usePlays";
import ViewContentLayout from "./common/components/ViewContentLayout";
import PlayList from "./PlayList";
import ReportDimensionReportTable from "./ReportDimensionReportTable";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import Heading1 from "./common/components/typography/Heading1";
import Heading3 from "./common/components/typography/Heading3";
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useComments } from "./common/hooks/useComments";
import { useGame } from "./common/hooks/useGame";
import usePlayer from "./common/hooks/usePlayer";
import Heading2 from "./common/components/typography/Heading2";
import ReportPlaymates from "./ReportPlaymates";
import { Game, GameMiscFieldDefinition } from "./domain/game";
import { Play, Player } from "./domain/play";
import ReportTable from "./ReportTable";
import { getGamePlayerStatistics } from "./domain/statistics";
import { renderPercentage, stringifyScore } from "./common/stringUtils";

export default function ReportPlayerGameView() {
  const params = useParams();
  const playerId = params.playerId!;
  const gameId = params.gameId!;
  const [plays, loadingPlays, errorPlays] = usePlays();
  const [game, loadingGame, errorGames] = useGame(gameId);
  const [comments] = useComments();
  const [player, loadingPlayer, errorPlayer] = usePlayer(playerId);

  const playerGamePlays = plays.filter(
    (p) => p.gameId === gameId && p.players.some((x) => x.id === playerId)
  );

  if (errorPlays || errorGames || errorPlayer) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }
  if (loadingPlays || loadingGame || loadingPlayer) {
    return <LoadingSpinner />;
  }

  if (!player) {
    return <>Player not found</>;
  }
  if (!game) {
    return <>Game not found</>;
  }
  const reportDimensions = game.getRelevantReportFields();

  return (
    <ViewContentLayout>
      <Heading1>
        <Link to={`/players/${playerId}`}>{player.name}</Link>
        {" / "}
        <Link to={`/games/${gameId}`}>{game.name}</Link>
      </Heading1>
      <p>Based on {playerGamePlays.length} plays.</p>
      <ScoresReportTable game={game} player={player} plays={playerGamePlays} />

      {reportDimensions.map((dimension) => {
        const playsWithDimension = playerGamePlays.filter((p) =>
          p.misc.some(
            (m) => m.fieldId === dimension.id && m.playerId === playerId
          )
        );
        return (
          <Fragment key={dimension.id}>
            <Heading2>{dimension.name}</Heading2>
            <p>Based on {playsWithDimension.length} plays.</p>
            <ReportDimensionReportTable
              plays={playsWithDimension}
              dimension={dimension}
              playerId={playerId}
            />
          </Fragment>
        );
      })}

      <Heading3>Most common playmates in {game.name}</Heading3>
      <ReportPlaymates
        player={player}
        playerPlays={playerGamePlays}
      ></ReportPlaymates>

      <Heading3>Plays of {game.name}</Heading3>
      <PlayList plays={playerGamePlays} games={[game]} comments={comments} />
    </ViewContentLayout>
  );
}

const ScoresReportTable = (props: {
  player: Player;
  game: Game;
  plays: Play[];
}) => {
  const { game, plays, player } = props;

  const otherDimensions = (game.miscFields ?? []).filter(
    (field) =>
      field.type === "number" &&
      field.valuePerPlayer &&
      field.isRelevantReportDimension
  ) as GameMiscFieldDefinition<number>[];

  const playerStats = getGamePlayerStatistics(
    game,
    plays,
    player.id,
    otherDimensions
  );
  const columns = [{ name: "Category" }, { name: "Value" }];
  const rows = [
    [
      { value: "Plays (no solo)" },
      {
        value: String(playerStats.playCount),
      },
    ],
    [
      { value: "Wins" },
      {
        value: renderPercentage(playerStats.winCount, playerStats.playCount),
      },
    ],
    [
      { value: "Normalized rank" },
      {
        value:
          playerStats.averageNormalizedPosition == null
            ? "–"
            : `${Math.round(
                100 - playerStats.averageNormalizedPosition * 100
              )}%`,
      },
    ],
    [
      { value: "Max winning score" },
      {
        value: stringifyScore(playerStats.maxWinningScore),
        link: playerStats.maxWinningScorePlay
          ? `/view/${playerStats.maxWinningScorePlay.id}`
          : undefined,
      },
    ],
    [
      { value: "Average winning score" },
      {
        value: stringifyScore(playerStats.averageWinningScore),
      },
    ],
    [
      { value: "Min winning score" },
      {
        value: stringifyScore(playerStats.minWinningScore),
        link: playerStats.minWinningScorePlay
          ? `/view/${playerStats.minWinningScorePlay.id}`
          : undefined,
      },
    ],
    ...otherDimensions.flatMap((field) => [
      [
        { value: `Maximum ${field.name}` },
        {
          value: playerStats.dimensions[field.id]?.maxValue?.toString() ?? "-",
        },
      ],
      [
        { value: `Average ${field.name}` },
        {
          value:
            playerStats.dimensions[field.id]?.averageValue?.toFixed(1) ?? "-",
        },
      ],
      [
        { value: `Minimum ${field.name}` },
        {
          value: playerStats.dimensions[field.id]?.minValue?.toString() ?? "-",
        },
      ],
    ]),
  ];

  return <ReportTable rows={rows} columns={columns}></ReportTable>;
};

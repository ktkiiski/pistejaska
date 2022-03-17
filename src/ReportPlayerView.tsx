import { Play, Player } from "./domain/play";
import { sortBy, flatMap, groupBy, uniq, mean, orderBy } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import ReportTable from "./ReportTable";
import { stringifyScore } from "./common/stringUtils";
import { calculateEloForPlayers } from "./domain/ratings";
import { useGames } from "./common/hooks/useGames";
import ViewContentLayout from "./common/components/ViewContentLayout";
import PlayList from "./PlayList";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import Heading1 from "./common/components/typography/Heading1";
import Table from "./common/components/tables/Table";
import TableHead from "./common/components/tables/TableHead";
import TableHeadCell from "./common/components/tables/TableHeadCell";
import Heading3 from "./common/components/typography/Heading3";
import TableBody from "./common/components/tables/TableBody";
import TableRow from "./common/components/tables/TableRow";
import TableCell from "./common/components/tables/TableCell";
import { FC, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Game } from "./domain/game";

interface Playmate {
  player: Player;
  plays: Play[];
}

function usePlaymates(playerId: string, playerPlays: Play[]): Playmate[] {
  const playmatesById: Record<string, Playmate> = {};
  playerPlays.forEach((play) => {
    play.players.forEach((other) => {
      const otherId = other.id;
      if (otherId !== playerId) {
        const playmate = playmatesById[otherId] ?? {
          player: other,
          plays: [],
        };
        playmatesById[otherId] = playmate;
        playmate.plays.push(play);
      }
    });
  });
  return orderBy(playmatesById, (playMate) => playMate.plays.length, "desc");
}

export const ReportPlayerView: FC = () => {
  const playerId = useParams().playerId!;
  const [plays, loadingPlays, errorPlays] = usePlays();
  const [games, loadingGames, errorGames] = useGames();
  const playerPlays = plays.filter((p) =>
    p.players.find((x) => x.id === playerId)
  );

  if (errorPlays || errorGames) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }
  if (loadingPlays || loadingGames) {
    return <LoadingSpinner />;
  }

  const player = flatMap(plays, (p) => p.players).find(
    (p) => p.id === playerId
  );

  if (!player) {
    return <>Error</>;
  }

  return (
    <ViewContentLayout>
      <Heading1>Reports: {player.name}</Heading1>
      <p>Based on {playerPlays.length} plays.</p>

      <div className="grid gap-4">
        <div>
          <Heading3>Most common playmates</Heading3>
          <Playmates player={player} playerPlays={playerPlays}></Playmates>
        </div>

        <div>
          <Heading3>Games</Heading3>
          <PlayerGamesReport
            player={player}
            plays={plays}
            games={games}
          ></PlayerGamesReport>
        </div>

        <div>
          <Heading3>Plays</Heading3>
          <PlayList plays={playerPlays} games={games} />
        </div>
      </div>
    </ViewContentLayout>
  );
};

const Playmates = (props: { player: Player; playerPlays: Play[] }) => {
  const { player, playerPlays } = props;
  const playmates = usePlaymates(player.id, playerPlays);
  const [isEveryPlaymateVisible, showAllPlaymates] = useReducer(
    () => true,
    false
  );
  const visiblePlaymates = isEveryPlaymateVisible
    ? playmates
    : playmates.slice(0, 10);

  return !playmates.length ? (
    <></>
  ) : (
    <>
      <Table>
        <TableHead>
          <tr>
            <TableHeadCell>Playmate</TableHeadCell>
            <TableHeadCell>Play count</TableHeadCell>
          </tr>
        </TableHead>
        <TableBody>
          {visiblePlaymates.map((playMate) => (
            <TableRow key={playMate.player.id}>
              <TableCell>
                <Link
                  className="cursor-pointer hover:text-black"
                  to={`/players/${playMate.player.id}`}
                >
                  {playMate.player.name}
                </Link>
              </TableCell>
              <TableCell>{playMate.plays.length}</TableCell>
            </TableRow>
          ))}
          {isEveryPlaymateVisible ||
          visiblePlaymates.length >= playmates.length ? null : (
            <TableRow className="cursor-pointer" onClick={showAllPlaymates}>
              <TableCell colSpan={2}>Show all playmates…</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

const PlayerGamesReport = (props: {
  player: Player;
  plays: Play[];
  games: Game[];
}) => {
  const { player, plays, games } = props;
  const playerPlays = plays.filter((p) =>
    p.players.find((x) => x.id === player.id)
  );
  const playerGames = uniq(Object.keys(groupBy(playerPlays, (p) => p.gameId)));

  const columns = [
    { name: "Game name" },
    { name: "Max points" },
    { name: "Best position" },
    {
      name: "Trueskill",
      tooltip:
        "The skill level percentile of player according to TrueSkill algorithm. Higher is better. If 90%, then the player estimated to be among the best 10% of players.",
    },
    { name: "Wins" },
    { name: "# of plays" },
    { name: "Time well spent" },
  ];

  const rows = playerGames.concat(["all"]).map((g) => {
    const gamePlays =
      g === "all" ? playerPlays : playerPlays.filter((x) => x.gameId === g);

    const allGamePlays =
      g === "all" ? plays : plays.filter((p) => p.gameId === g);
    const allGameDurations = allGamePlays
      .map((p) => p.getDurationInHours())
      .filter((duration) => duration != null);
    const avgGameDuration = mean(allGameDurations); // NOTE: Will be NaN if no information available

    const maxScoresPlay = sortBy(gamePlays, (p) =>
      p.getTotal(player.id)
    ).reverse()[0];
    const bestPositionPlay = sortBy(gamePlays, (p) =>
      p.getPosition(player.id)
    )[0];
    const winnedPlays = gamePlays.filter((p) => p.getPosition(player.id) === 1);

    const game = games?.find((x) => x.id === g);

    // if player has played 3 or more plays, only compare to players who have also played 3 or mote games
    let trueSkills = calculateEloForPlayers(allGamePlays, 3);
    let playerTrueSkillIndex = trueSkills.findIndex((x) => x.id === player.id);
    if (playerTrueSkillIndex === -1) {
      // if player has played < 3 games, compare to all players
      trueSkills = calculateEloForPlayers(allGamePlays, 0);
      playerTrueSkillIndex = trueSkills.findIndex((x) => x.id === player.id);
    }

    // calculate skill percentile
    const percentile =
      Math.round(
        Math.round(
          ((trueSkills.length - playerTrueSkillIndex) / trueSkills.length) * 100
        ) / 10
      ) * 10;
    const totalGamePlayTime = gamePlays.reduce(
      (sum, play) => sum + (play.getDurationInHours() ?? avgGameDuration),
      0
    );

    return [
      {
        value: game?.name ?? "All",
        link: game ? `/games/${game?.id}` : undefined,
      },
      {
        value: stringifyScore(maxScoresPlay.getTotal(player.id)),
        link: `/view/${maxScoresPlay.id}`,
      },
      {
        value: bestPositionPlay.getPosition(player.id).toString(),
        link: `/view/${bestPositionPlay.id}`,
      },
      {
        value: `${percentile}%`,
      },
      {
        value: `${Math.round(
          (winnedPlays.length / gamePlays.length) * 100
        )}% (${winnedPlays.length})`,
      },
      {
        value: gamePlays.length.toString(),
      },
      {
        value: Number.isNaN(totalGamePlayTime)
          ? "N/A"
          : `${totalGamePlayTime.toFixed(1)}h`,
      },
    ];
  });

  return <ReportTable rows={rows} columns={columns}></ReportTable>;
};

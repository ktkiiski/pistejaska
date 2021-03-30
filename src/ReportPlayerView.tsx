import React from "react";

import { Play, Player } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { sortBy, flatMap, groupBy, uniq, mean } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import ReportTable from "./ReportTable";
import { stringifyScore } from "./common/stringUtils";
import { calculateEloForPlayers } from "./domain/ratings";
import { useGames } from "./common/hooks/useGames";
import GameTrendChart from "./GameTrendChart";

export const ReportPlayerView = (props: RouteComponentProps<any>) => {
  const playerId = props.match.params["playerId"];

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

  const player = flatMap(plays, (p) => p.players).find(
    (p) => p.id === playerId
  );

  const playerPlays = plays.filter((p) =>
    p.players.find((x) => x.id === playerId)
  );

  if (!player) {
    return <>Error</>;
  }

  return (
    <div>
      <h2>Reports: {player.name}</h2>
      <p>Based on {playerPlays.length} plays.</p>
      <GameTrendChart plays={playerPlays} />
      <PlayerGamesReport
        player={player}
        plays={plays}
      ></PlayerGamesReport>
    </div>
  );
};

const PlayerGamesReport = (props: { player: Player; plays: Play[] }) => {
  const games = useGames();
  const { player, plays } = props;
  const playerPlays = plays.filter(p => p.players.find(x => x.id === player.id));
  const playerGames = uniq(Object.keys(groupBy(playerPlays, (p) => p.gameId)));

  const columns = [
    { name: "Game name" },
    { name: "Max points" },
    { name: "Best position" },
    { name: "Trueskill percentile", tooltip: "The skill level percentile of player according to TrueSkill algorithm. Higher is better. If 90%, then the player estimated to be among the best 10% of players." },
    { name: "Wins" },
    { name: "# of plays" },
    { name: "Time well spent" },
  ];

  if (!games) {
    // Still loading games
    return <div>Loading…</div>;
  }

  const rows = playerGames.concat(["all"]).map((g) => {
    const gamePlays = g === "all" ? playerPlays : playerPlays.filter((x) => x.gameId === g);

    const allGamePlays = g === "all" ? plays : plays.filter(p => p.gameId === g);
    const allGameDurations = allGamePlays.map(p => p.getDurationInHours()).filter(duration => duration != null);
    const avgGameDuration = mean(allGameDurations); // NOTE: Will be NaN if no information available

    const maxScoresPlay = sortBy(gamePlays, (p) =>
      p.getTotal(player.id)
    ).reverse()[0];
    const bestPositionPlay = sortBy(gamePlays, (p) =>
      p.getPosition(player.id)
    )[0];
    const winnedPlays = gamePlays.filter(p => p.getPosition(player.id) === 1);

    const game = games?.find((x) => x.id === g);

    // if player has played 3 or more plays, only compare to players who have also played 3 or mote games
    let trueSkills = calculateEloForPlayers(allGamePlays, 3);
    let playerTrueSkillIndex = trueSkills.findIndex(x => x.id === player.id);
    if (playerTrueSkillIndex === -1) {
      // if player has played < 3 games, compare to all players
      trueSkills = calculateEloForPlayers(allGamePlays, 0);
      playerTrueSkillIndex = trueSkills.findIndex(x => x.id === player.id);
    }

    // calculate skill percentile
    const percentile = Math.round(Math.round((trueSkills.length- playerTrueSkillIndex) / trueSkills.length * 100)/10)*10;
    const totalGamePlayTime = gamePlays.reduce((sum, play) => sum + (play.getDurationInHours() ?? avgGameDuration), 0);

    return [
      {
        value: game?.name ?? "All",
        link: game ? `/games/${game?.id}` : undefined
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
        value: `${Math.round((winnedPlays.length/gamePlays.length*100))}% (${winnedPlays.length})`,
      },
      {
        value: gamePlays.length.toString(),
      },
      {
        value: Number.isNaN(totalGamePlayTime) ? 'N/A' : `${totalGamePlayTime.toFixed(1)}h`
      }
    ];
  });

  return <ReportTable rows={rows} columns={columns}></ReportTable>;
};

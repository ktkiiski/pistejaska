import React from "react";

import { Play, Player } from "./domain/play";
import { RouteComponentProps } from "react-router";
import { games } from "./domain/games";
import { sortBy, flatMap, groupBy, uniq } from "lodash";
import { usePlays } from "./common/hooks/usePlays";
import ReportTable from "./ReportTable";
import { stringifyScore } from "./common/stringUtils";

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

      <PlayerGamesReport
        player={player}
        playerPlays={playerPlays}
      ></PlayerGamesReport>
    </div>
  );
};

const PlayerGamesReport = (props: { player: Player; playerPlays: Play[] }) => {
  const { player, playerPlays } = props;
  const playerGames = uniq(Object.keys(groupBy(playerPlays, (p) => p.gameId)));

  const columns = [
    { name: "Game name" },
    { name: "Max points" },
    { name: "Best position" },
    { name: "Wins" },
    { name: "# of plays" },
  ];

  const rows = playerGames.concat(["all"]).map((g) => {
    const gamePlays = g === "all" ? playerPlays : playerPlays.filter((x) => x.gameId === g);

    const maxScoresPlay = sortBy(gamePlays, (p) =>
      p.getTotal(player.id)
    ).reverse()[0];
    const bestPositionPlay = sortBy(gamePlays, (p) =>
      p.getPosition(player.id)
    )[0];
    const winnedPlays = gamePlays.filter(p => p.getPosition(player.id) === 1);

    const game = games.find((x) => x.id === g);
    return [
      {
        value: game?.name ?? "All",
        link: game ? `/reports/game/${game?.id}` : undefined
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
        value: `${Math.round((winnedPlays.length/gamePlays.length*100))}% (${winnedPlays.length})`,
      },
      {
        value: gamePlays.length.toString(),
      },
    ];
  });

  return <ReportTable rows={rows} columns={columns}></ReportTable>;
};
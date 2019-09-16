import { Play, Player } from "./play";
import { map, groupBy, sortBy, orderBy } from "lodash";
var eloRating = require("elo-rating");

export const calculateEloForPlayers = (plays: Play[]) => {
  const allPlayers = map(
    groupBy(plays.flatMap(v => v.players), p => p.id),
    p => p[0]
  ).map(p => {
    return { ...p, ...{ elo: 1000 } };
  });

  function evaluate1v1(player: Player, opponent: Player, playerWin: boolean) {
    const result = eloRating.calculate(player.elo, opponent.elo, playerWin);
    const outComeString = playerWin ? "WIN" : "LOST to";
    const msg = `${player.name} (${player.elo}) ${outComeString} to ${opponent.name} (${opponent.elo})`;
    player.elo = result.playerRating;
    opponent.elo = result.opponentRating;
    console.log(
      msg +
        ` => ${player.name} (${player.elo}) ${opponent.name} (${opponent.elo})`
    );
  }

  const evaluatePlay = (play: Play) => {
    const playersByPosition = play.getPlayersByPosition();
    orderBy(play.players, p => play.getPosition(p)).forEach(player => {
      // ELO is designed for 1v1 games so simulate 1v1 matches by making each
      // player play two games: winning player below and losing to player above.
      const position = play.getPosition(player) - 1;
      const lostToPlayer =
        position > 0 ? playersByPosition[position - 1] : null;
      const wonPlayer =
        position < playersByPosition.length - 1
          ? playersByPosition[position + 1]
          : null;

      const eloPlayer = allPlayers.find(p => p.id === player.id) || ({} as any);
      if (lostToPlayer) {
        const opponent =
          allPlayers.find(p => p.id === lostToPlayer.id) || ({} as any);
        evaluate1v1(eloPlayer, opponent, false);
      }
      if (wonPlayer) {
        const opponent =
          allPlayers.find(p => p.id === wonPlayer.id) || ({} as any);
        evaluate1v1(eloPlayer, opponent, true);
      }
    });
  };

  orderBy(orderBy(plays, p => p.created), p => p.date).forEach(play => {
    console.log("Evaluating play " + play.getName());

    evaluatePlay(play);

    console.log("\nCurrent ratings:\n");
    sortBy(allPlayers, p => -p.elo).map(p => console.log(p));
    console.log("\n\n");
  });

  return sortBy(allPlayers, p => -p.elo);
};

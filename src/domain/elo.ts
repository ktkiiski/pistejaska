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
    orderBy(play.players, p => play.getPosition(p)).forEach(player => {
      // ELO is designed for 1v1 games so simulate 1v1 matches by making each
      // player play two games: winning player below and losing to player above.
      // in case of ties all players one position up (or down) are evaluated
      const position = play.getPosition(player);

      const lostToPlayers = play.getPlayerOnePositionUpFrom(position);
      const wonPlayers = play.getPlayerOnePositionDownFrom(position);

      const eloPlayer = allPlayers.find(p => p.id === player.id) || ({} as any);

      // TODO PANU: now most pairs are evaluated twice - is it good?
      lostToPlayers.forEach(lostToPlayer => {
        const opponent =
          allPlayers.find(p => p.id === lostToPlayer.id) || ({} as any);
        evaluate1v1(eloPlayer, opponent, false);
      });

      wonPlayers.forEach(wonPlayer => {
        const opponent =
          allPlayers.find(p => p.id === wonPlayer.id) || ({} as any);
        evaluate1v1(eloPlayer, opponent, true);
      });
    });
  };

  orderBy(plays, ["date", "created"], ["asc", "asc"]).forEach(play => {
    console.log("Evaluating play " + play.getName());

    evaluatePlay(play);

    console.log("\nCurrent ratings:\n");
    sortBy(allPlayers, p => -p.elo).map(p => console.log(p));
    console.log("\n\n");
  });

  return sortBy(allPlayers, p => -p.elo);
};

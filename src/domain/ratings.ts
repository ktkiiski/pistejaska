import { Play } from "./play";
import { map, groupBy, sortBy, orderBy } from "lodash";
import { rate, Rating } from "ts-trueskill";

function countPlaysForPlayerId(playerId: string, plays: Play[]) {
  return plays.reduce((count, play) => (
    play.players.some(p => p.id === playerId) ? count + 1 : count
  ), 0);
}

export const calculateEloForPlayers = (plays: Play[], minPlays: number) => {
  const allPlayers = map(
    groupBy(plays.flatMap(v => v.players), p => p.id),
    p => p[0]
  ).map(player => ({
    ...player,
    playCount: countPlaysForPlayerId(player.id, plays),
    rating: new Rating(),
  }));
  // Ensure that minPlays is not larger than the number of games anyone has played
  const maxPlayCount = Math.max(0, ...allPlayers.map(p => p.playCount));
  minPlays = Math.min(minPlays, maxPlayCount);

  const evaluatePlay = (play: Play) => {
    const players = orderBy(
      play.players.map(p => {
        return {
          player: p,
          rating: (allPlayers.find(x => x.id === p.id) as any).rating
        };
      }),
      p => play.getPosition(p.player)
    );
    // NOTE: ties are not evaluated correctly
    const newRatings = rate(
      players.map(p => {
        return [p.rating];
      })
    );

    newRatings.forEach((rating, idx) => (players[idx].rating = rating[0]));

    players.forEach(
      p =>
        ((allPlayers.find(x => x.id === p.player.id) as any).rating = p.rating)
    );
  };

  orderBy(plays, ["date", "created"], ["asc", "asc"]).forEach(play => {
    console.log("Evaluating play " + play.getName());
    orderBy(play.players, p => play.getPosition(p)).forEach((p, idx) =>
      console.log(idx + 1 + ". " + p.name)
    );
    console.log("\n");
    evaluatePlay(play);

    console.log("\nNew ratings:\n");
    sortBy(allPlayers, p => -p.rating.mu).forEach(p =>
      console.log(
        `${p.name}: ${p.rating.mu} (±${3 * p.rating.sigma}, ${p.playCount} plays)`
      )
    );
    console.log("\n\n");
  });

  return sortBy(
    allPlayers.filter(player => player.playCount >= minPlays),
    p => -p.rating.mu
  );
};

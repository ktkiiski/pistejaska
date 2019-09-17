import { Play } from "./play";
import { map, groupBy, sortBy, orderBy } from "lodash";
import { rate, Rating } from "ts-trueskill";

export const calculateEloForPlayers = (plays: Play[]) => {
  const allPlayers = map(
    groupBy(plays.flatMap(v => v.players), p => p.id),
    p => p[0]
  ).map(p => {
    return { ...p, ...{ rating: new Rating() } };
  });

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
    sortBy(allPlayers, p => -p.rating.mu).map(p =>
      console.log(
        p.name + ": " + p.rating.mu + " (±" + 3 * p.rating.sigma + ")"
      )
    );
    console.log("\n\n");
  });

  return sortBy(allPlayers, p => -p.rating.mu);
};

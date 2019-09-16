import { usePlays } from "./usePlays";
import { groupBy, map, sortBy } from "lodash";
import { Player } from "../../domain/play";

export const usePlayers = (): [Player[], boolean, Error | undefined] => {
  const [plays, loading, error] = usePlays();
  if (plays.length === 0) return [[], loading, error];

  // sorted by the number of plays, so that most common players are first
  const allPlayers = sortBy(
    groupBy(plays.flatMap(v => v.players), p => p.id),
    group => -group.length
  );

  const players = map(allPlayers, p => p[0]);

  return [players, loading, error];
};

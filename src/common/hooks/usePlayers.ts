import { usePlays } from "./usePlays";
import { groupBy, map, sortBy } from "lodash";
import { Player } from "../../domain/play";
import { useMemo } from "react";

export const usePlayers = (): [Player[], boolean, Error | undefined] => {
  const [plays, loading, error] = usePlays();

  const players = useMemo(() => {
    // sorted by the number of plays, so that most common players are first
    const allPlayers = sortBy(
      groupBy(
        plays.flatMap((v) => v.players),
        (p) => p.id
      ),
      (group) => -group.length
    );

    return map(allPlayers, (p) => p[0]);
  }, [plays]);

  return [players, loading, error];
};

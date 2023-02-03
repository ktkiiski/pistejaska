import { Player } from "../../domain/play";
import { usePlayers } from "./usePlayers";

export default function usePlayer(
  playerId: string
): [Player | null | undefined, boolean, Error | undefined] {
  const [players, loading, error] = usePlayers();
  const player = loading
    ? undefined
    : players.find((g) => g.id === playerId) ?? null;
  return [player, loading, error];
}

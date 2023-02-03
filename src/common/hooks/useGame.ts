import { Game } from "../../domain/game";
import { useGames } from "./useGames";

export function useGame(
  gameId: string
): [Game | null | undefined, boolean, Error | undefined] {
  const [games, loading, error] = useGames();
  const game = loading ? undefined : games.find((g) => g.id === gameId) ?? null;
  return [game, loading, error];
}

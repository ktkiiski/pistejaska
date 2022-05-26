import { Play } from "../../domain/play";
import { usePlays } from "./usePlays";

export default function usePlaysByPlayerId(): [
  Record<string, Play[]>,
  boolean,
  Error | undefined
] {
  const [plays, loading, error] = usePlays();
  const playsByPlayerId: Record<string, Play[]> = {};
  plays.forEach((play) => {
    play.players.forEach(({ id }) => {
      const playerPlays = playsByPlayerId[id] ?? [];
      playerPlays.push(play);
      playsByPlayerId[id] = playerPlays;
    });
  });
  return [playsByPlayerId, loading, error];
}

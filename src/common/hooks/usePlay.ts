import { Play } from "../../domain/play";
import { usePlays } from "./usePlays";

export const usePlay = (
  playId: string
): [Play | null, boolean, Error | undefined] => {
  const [plays, loading, error] = usePlays();
  return [plays.find((play) => play.id === playId) || null, loading, error];
};

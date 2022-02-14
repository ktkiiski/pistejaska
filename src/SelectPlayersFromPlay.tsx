import { FC } from "react";
import SelectPlayers from "./SelectPlayers";
import { usePlay } from "./common/hooks/usePlay";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import { useParams } from "react-router-dom";

const ReplayView: FC = () => {
  const playId = useParams().playId!;
  const [play, loading] = usePlay(playId);
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!play) {
    return <div>Play not found</div>;
  }
  return <SelectPlayers gameId={play.gameId} initialPlayers={play?.players} />;
};

export default ReplayView;

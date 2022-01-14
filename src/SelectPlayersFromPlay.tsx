import React from "react";
import SelectPlayers from "./SelectPlayers";
import { usePlay } from "./common/hooks/usePlay";
import { LoadingSpinner } from "./common/components/LoadingSpinner";

function SelectPlayersFromPlay(props: { playId: string }) {
  const { playId } = props;
  const [play, loading] = usePlay(playId);
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!play) {
    return <div>Play not found</div>;
  }
  return <SelectPlayers gameId={play.gameId} initialPlayers={play?.players} />;
}

export default SelectPlayersFromPlay;

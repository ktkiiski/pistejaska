import React from "react";
import SelectPlayers from "./SelectPlayers";
import { usePlay } from "./common/hooks/usePlay";

function SelectPlayersFromPlay(props: { playId: string }) {
  const { playId } = props;
  const [play, loading] = usePlay(playId);
  if (loading) {
    return <div>Loading…</div>;
  }
  if (!play) {
    return <div>Play not found</div>;
  }
  return <SelectPlayers gameId={play.gameId} initialPlayers={play?.players} />;
}

export default SelectPlayersFromPlay;

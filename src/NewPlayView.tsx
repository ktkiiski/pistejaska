import { FC } from "react";
import { useParams } from "react-router-dom";
import SelectPlayers from "./SelectPlayers";

const NewPlayView: FC = () => {
  const gameId = useParams().gameId!;
  return <SelectPlayers gameId={gameId} />;
};

export default NewPlayView;

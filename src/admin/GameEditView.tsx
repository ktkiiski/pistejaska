import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "../common/hooks/useGame";
import { LoadingSpinner } from "../common/components/LoadingSpinner";
import GameForm from "./GameForm";
import ViewContentLayout from "../common/components/ViewContentLayout";
import ButtonBack from "../common/components/buttons/ButtonBack";
import React from "react";
import Heading1 from "../common/components/typography/Heading1";

export default function GameEditView() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [game, loading, error] = useGame(gameId!);

  if (error) {
    console.error(error);
  }

  return (
    <ViewContentLayout
      header={<ButtonBack onClick={() => navigate("/admin")} />}
    >
      <Heading1>Edit game{game && `: ${game.name}`}</Heading1>
      {loading && <LoadingSpinner />}
      {error && (
        <div className="text-center">Error loading game: {error.message}</div>
      )}
      {!loading && !game && !error && (
        <div className="text-center">Game with id "{gameId}" not found</div>
      )}
      {game && <GameForm game={game} />}
    </ViewContentLayout>
  );
}

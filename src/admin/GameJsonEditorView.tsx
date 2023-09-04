import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameDefinition } from "../domain/game";
import GameJsonEditor from "./GameJsonEditor";
import { useGames } from "../common/hooks/useGames";
import ButtonBack from "../common/components/buttons/ButtonBack";
import Heading2 from "../common/components/typography/Heading2";
import NativeSelectField from "../common/components/inputs/NativeSelectField";
import ViewContentLayout from "../common/components/ViewContentLayout";
import saveGame from "../utils/saveGame";
import deleteGame from "../utils/deleteGame";

const defaultGameJson: GameDefinition = {
  id: "",
  name: "",
  icon: "",
  simultaneousTurns: false,
  scoreFields: [],
};

function GameJsonEditorView() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<string | null>(null);

  const [games] = useGames();
  const initialGameJson = !games
    ? null
    : games.find((game) => game.id === gameId) || defaultGameJson;
  return (
    <ViewContentLayout
      header={<ButtonBack onClick={() => navigate("/admin")} />}
    >
      <NativeSelectField
        className="w-full"
        label="Edited game"
        value={gameId}
        onChange={setGameId}
        options={[
          ...games.map((game) => ({
            value: game.id,
            label: game.name || game.id,
          })),
          {
            value: null,
            label: "(New game)",
          },
        ]}
      />
      <Heading2>
        {gameId
          ? `Edit game: ${initialGameJson?.name ?? gameId}`
          : "Create new game"}
      </Heading2>
      {!initialGameJson ? null : (
        <GameJsonEditor
          json={initialGameJson}
          onSubmit={async (json) => {
            await saveGame(json);
            setGameId(json.id);
          }}
          onDelete={
            !gameId
              ? null
              : async () => {
                  if (
                    !window.confirm(
                      `Are you sure you want to permanently delete the game "${
                        initialGameJson.name ?? gameId
                      }"?`
                    )
                  ) {
                    return;
                  }
                  await deleteGame(gameId);
                  setGameId(null);
                }
          }
          submitButtonLabel={gameId ? "Update game" : "Create game"}
        />
      )}
    </ViewContentLayout>
  );
}

export default GameJsonEditorView;

import React, { useState } from "react";
import { GameDefinition } from "./domain/game";
import AdminGameEditor from "./AdminGameEditor";
import { useGames } from "./common/hooks/useGames";
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "./common/firebase";
import Heading2 from "./common/components/typography/Heading2";
import NativeSelectField from "./common/components/inputs/NativeSelectField";
import ViewContentLayout from "./common/components/ViewContentLayout";

const defaultGameJson: GameDefinition = {
  id: "",
  name: "",
  icon: "",
  simultaneousTurns: false,
  scoreFields: [],
};

function Admin() {
  const [gameId, setGameId] = useState<string | null>(null);

  const [games] = useGames();
  const initialGameJson = !games
    ? null
    : games.find((game) => game.id === gameId) || defaultGameJson;
  return (
    <ViewContentLayout>
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
        <AdminGameEditor
          json={initialGameJson}
          onSubmit={async (json) => {
            const { id } = json;
            if (!id) {
              throw new Error("Missing game ID");
            }

            const db = getFirestore(app);
            await setDoc(doc(db, "games", id), json);
            setGameId(id);
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
                  const db = getFirestore(app);
                  await deleteDoc(doc(db, "games", gameId));
                  setGameId(null);
                }
          }
          submitButtonLabel={gameId ? "Update game" : "Create game"}
        />
      )}
    </ViewContentLayout>
  );
}

export default Admin;

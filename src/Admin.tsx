import React, { useState } from "react";
import { GameDefinition } from "./domain/game";
import { FormControl, makeStyles, MenuItem, Select } from "@material-ui/core";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "./common/firebase";
import AdminGameEditor from "./AdminGameEditor";

const useStyles = makeStyles((theme) => ({
  edit: {
    textAlign: "left",
    padding: theme.spacing(4),
  },
  gameSelect: {
    width: "100%",
  },
}));

const defaultGameJson: GameDefinition = {
  id: "",
  name: "",
  icon: "",
  simultaneousTurns: false,
  scoreFields: [],
};

function Admin() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [games] = useCollectionData<GameDefinition>(
    firestore().collection("games").orderBy("name")
  );
  const styles = useStyles();
  const initialGameJson = !games
    ? null
    : games.find((game) => game.id === gameId) || defaultGameJson;
  return (
    <div className={styles.edit}>
      <h2>Admin</h2>
      <FormControl className={styles.gameSelect}>
        <Select
          labelId="admin-game-select"
          value={gameId || ""}
          displayEmpty
          onChange={(event) => {
            setGameId(event.target.value as string);
          }}
        >
          {games?.map((game) => (
            <MenuItem key={game.id} value={game.id}>
              {game.name || game.id}
            </MenuItem>
          ))}
          <MenuItem value="">(New game)</MenuItem>
        </Select>
      </FormControl>
      <h3>
        {gameId
          ? `Edit: ${initialGameJson?.name ?? gameId}`
          : "Create new game"}
      </h3>
      {!initialGameJson ? null : (
        <AdminGameEditor
          json={initialGameJson}
          onSubmit={async (json) => {
            const { id } = json;
            if (!id) {
              throw new Error("Missing game ID");
            }
            await firestore().collection("games").doc(id).set(json);
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
                  await firestore().collection("games").doc(gameId).delete();
                  setGameId(null);
                }
          }
          submitButtonLabel={gameId ? "Update game" : "Create game"}
        />
      )}
    </div>
  );
}

export default Admin;

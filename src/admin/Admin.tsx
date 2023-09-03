import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../common/components/buttons/Button";
import ButtonPrimary from "../common/components/buttons/ButtonPrimary";
import CardButtonRow from "../common/components/buttons/CardButtonRow";
import Heading1 from "../common/components/typography/Heading1";
import ViewContentLayout from "../common/components/ViewContentLayout";
import { useGames } from "../common/hooks/useGames";
import NativeSelectField from "../common/components/inputs/NativeSelectField";

export default function Admin() {
  const navigate = useNavigate();
  const [games] = useGames();
  const [gameId, setGameId] = useState<string | null>(null);

  return (
    <ViewContentLayout>
      <Heading1>Add and edit games</Heading1>
      <CardButtonRow>
        <ButtonPrimary onClick={() => navigate("/admin/add-game")}>
          Add new game (beta)
        </ButtonPrimary>
        <Button onClick={() => navigate("/admin/edit-game-json")}>
          Game JSON Editor
        </Button>
      </CardButtonRow>

      <div className="flex flex-row gap-2 items-center max-w-lg mx-auto mt-3">
        <NativeSelectField
          className="flex-1"
          label="Edit existing game"
          value={gameId}
          onChange={setGameId}
          options={games.map((game) => ({
            value: game.id,
            label: game.name || game.id,
          }))}
        />
        <ButtonPrimary
          onClick={() => navigate(`/admin/edit-game/${gameId}`)}
          disabled={!gameId}
        >
          Edit game (beta)
        </ButtonPrimary>
      </div>
    </ViewContentLayout>
  );
}

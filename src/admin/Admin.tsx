import { useNavigate } from "react-router-dom";
import Button from "../common/components/buttons/Button";
import ButtonPrimary from "../common/components/buttons/ButtonPrimary";
import CardButtonRow from "../common/components/buttons/CardButtonRow";
import Heading1 from "../common/components/typography/Heading1";
import ViewContentLayout from "../common/components/ViewContentLayout";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <ViewContentLayout>
      <Heading1>Add and edit games</Heading1>
      <CardButtonRow>
        <ButtonPrimary onClick={() => navigate("/admin/edit-game")}>
          Add new game (beta)
        </ButtonPrimary>
        <Button onClick={() => navigate("/admin/edit-game-json")}>
          Game JSON Editor
        </Button>
      </CardButtonRow>
    </ViewContentLayout>
  );
}

import GameForm from "./GameForm";
import ViewContentLayout from "../common/components/ViewContentLayout";
import ButtonBack from "../common/components/buttons/ButtonBack";
import React from "react";
import { useNavigate } from "react-router-dom";
import Heading1 from "../common/components/typography/Heading1";

export default function GameAddView() {
  const navigate = useNavigate();

  return (
    <ViewContentLayout
      header={<ButtonBack onClick={() => navigate("/admin")} />}
    >
      <Heading1>Add new game</Heading1>
      <GameForm />
    </ViewContentLayout>
  )
}

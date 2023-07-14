import { useNavigate } from "react-router-dom";
import ButtonBack from "./common/components/buttons/ButtonBack";
import Heading1 from "./common/components/typography/Heading1";
import ViewContentLayout from "./common/components/ViewContentLayout";
import React from "react";

export default function AdminGameEditView() {
  const navigate = useNavigate();

  return (
    <ViewContentLayout
      header={<ButtonBack onClick={() => navigate("/admin")} />}
    >
      <Heading1>Add new game</Heading1>
    </ViewContentLayout>
  );
}

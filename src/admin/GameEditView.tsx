import { useNavigate } from "react-router-dom";
import ButtonBack from "../common/components/buttons/ButtonBack";
import Heading1 from "../common/components/typography/Heading1";
import ViewContentLayout from "../common/components/ViewContentLayout";
import React, { useMemo, useState } from "react";
import EditGameBasicInfo from "./EditGameBasicInfo";
import { GameBasicInfoDefinition, GameDefinition } from "../domain/game";

const defaultGameJson: GameDefinition = {
  id: "",
  name: "",
  icon: "",
  simultaneousTurns: false,
  scoreFields: [],
};

export default function GameEditView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultGameJson);
  const basicInfo: GameBasicInfoDefinition = useMemo(
    () => ({
      id: formData.id,
      name: formData.name,
      icon: formData.icon,
      simultaneousTurns: formData.simultaneousTurns,
    }),
    [formData.id, formData.name, formData.icon, formData.simultaneousTurns]
  );

  return (
    <ViewContentLayout
      header={<ButtonBack onClick={() => navigate("/admin")} />}
    >
      <div className="flex flex-col items-center pb-2 space-y-1 text-left">
        <Heading1>Add new game</Heading1>
        <EditGameBasicInfo
          basicInfo={basicInfo}
          onBasicInfoChange={(updatedBasicInfo) =>
            setFormData({ ...formData, ...updatedBasicInfo })
          }
        />
      </div>
    </ViewContentLayout>
  );
}

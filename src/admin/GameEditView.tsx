import { useNavigate } from "react-router-dom";
import ButtonBack from "../common/components/buttons/ButtonBack";
import Heading1 from "../common/components/typography/Heading1";
import ViewContentLayout from "../common/components/ViewContentLayout";
import React, { useState } from "react";
import EditGameBasicInfo from "./EditGameBasicInfo";
import {
  GameBasicInfoDefinition,
  GameScoreFieldDefinition,
} from "../domain/game";
import EditGameScoreField from "./EditGameScoreField";
import Heading2 from "../common/components/typography/Heading2";
import ButtonLight from "../common/components/buttons/ButtonLight";
import { omit } from "lodash";

interface KeyedScoreFields {
  [key: string]: GameScoreFieldDefinition;
}

function getDefaultBasicInfo(): GameBasicInfoDefinition {
  return { id: "", name: "", icon: "", simultaneousTurns: false };
}

function getDefaultScoreField(): KeyedScoreFields {
  return { [crypto.randomUUID()]: { id: "", name: "", type: "number" } };
}

export default function GameEditView() {
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState(getDefaultBasicInfo);
  const [scoreFields, setScoreFields] = useState(getDefaultScoreField);

  return (
    <ViewContentLayout
      header={<ButtonBack onClick={() => navigate("/admin")} />}
    >
      <Heading1>Add new game</Heading1>
      <div className="flex flex-col items-center pb-2 space-y-1">
        <EditGameBasicInfo
          basicInfo={basicInfo}
          onBasicInfoChange={(updatedBasicInfo) =>
            setBasicInfo({ ...basicInfo, ...updatedBasicInfo })
          }
        />
      </div>

      <Heading2>Score fields</Heading2>
      <div className="flex flex-col items-center pb-2 space-y-4">
        {Object.entries(scoreFields).map(([key, scoreField]) => (
          <EditGameScoreField
            key={key}
            scoreField={scoreField}
            onScoreFieldChange={(updatedScoreField) =>
              setScoreFields({ ...scoreFields, [key]: updatedScoreField })
            }
            onScoreFieldRemove={() => setScoreFields(omit(scoreFields, key))}
          />
        ))}
        <ButtonLight
          onClick={() =>
            setScoreFields({ ...scoreFields, ...getDefaultScoreField() })
          }
        >
          Add score field
        </ButtonLight>
      </div>
    </ViewContentLayout>
  );
}

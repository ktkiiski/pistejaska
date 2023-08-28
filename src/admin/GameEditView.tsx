import { useNavigate } from "react-router-dom";
import ButtonBack from "../common/components/buttons/ButtonBack";
import Heading1 from "../common/components/typography/Heading1";
import ViewContentLayout from "../common/components/ViewContentLayout";
import React, { FormEvent, useState } from "react";
import EditGameBasicInfo from "./EditGameBasicInfo";
import {
  GameBasicInfoDefinition,
  GameDefinition,
  GameFieldOption,
  GameMiscFieldDefinition,
  GameScoreFieldDefinition,
} from "../domain/game";
import EditGameScoreField from "./EditGameScoreField";
import Heading2 from "../common/components/typography/Heading2";
import ButtonLight from "../common/components/buttons/ButtonLight";
import { isEmpty, omit } from "lodash";
import EditGameMiscField from "./EditGameMiscField";
import ButtonPrimary from "../common/components/buttons/ButtonPrimary";
import Spinner from "../common/components/Spinner";
import { IconSmileyFace } from "../common/components/icons/IconSmileyFace";
import classNames from "classnames";
import saveGame from "../utils/saveGame";

interface KeyedScoreFields {
  [key: string]: GameScoreFieldDefinition;
}

interface KeyedMiscFields {
  [key: string]: GameMiscFieldDefinition;
}

function getDefaultBasicInfo(): GameBasicInfoDefinition {
  return { id: "", name: "", icon: "", simultaneousTurns: false };
}

function getDefaultScoreField(): KeyedScoreFields {
  return { [crypto.randomUUID()]: { id: "", name: "", type: "number" } };
}

function getDefaultMiscField(): KeyedMiscFields {
  return { [crypto.randomUUID()]: { id: "", name: "", type: "text" } };
}

function omitEmptyOptions(
  miscFields: GameMiscFieldDefinition[]
): GameMiscFieldDefinition[] {
  const isNotEmpty = (option: GameFieldOption<unknown>) =>
    !isEmpty(option.label) || !isEmpty(option.value);
  return miscFields.map((miscField) => ({
    ...miscField,
    options: miscField.options?.some(isNotEmpty)
      ? miscField.options.filter(isNotEmpty)
      : undefined,
  }));
}

export default function GameEditView() {
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState(getDefaultBasicInfo);
  const [scoreFields, setScoreFields] = useState(getDefaultScoreField);
  const [miscFields, setMiscFields] = useState<KeyedMiscFields>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    if (isSaving || isSaved) return;
    setIsSaving(true);
    const game: GameDefinition = {
      ...basicInfo,
      scoreFields: Object.values(scoreFields),
      miscFields: omitEmptyOptions(Object.values(miscFields)),
    };

    try {
      await saveGame(game);
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch (e) {
      setIsSaving(false);
      setIsSaved(false);
      console.error(e);
      alert(e);
    }
  };

  return (
    <ViewContentLayout
      header={<ButtonBack onClick={() => navigate("/admin")} />}
    >
      <form onSubmit={onSave}>
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
          {Object.entries(scoreFields).map(([key, scoreField], i) => (
            <EditGameScoreField
              key={key}
              scoreField={scoreField}
              onScoreFieldChange={(updatedScoreField) =>
                setScoreFields({ ...scoreFields, [key]: updatedScoreField })
              }
              onScoreFieldRemove={() => setScoreFields(omit(scoreFields, key))}
              autoFocusFirstField={i !== 0}
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

        <Heading2>Miscellaneous fields</Heading2>
        <div className="flex flex-col items-center pb-2 space-y-4">
          {Object.entries(miscFields).map(([key, miscField]) => (
            <EditGameMiscField
              key={key}
              miscField={miscField}
              onMiscFieldChange={(updatedMiscField) =>
                setMiscFields({ ...miscFields, [key]: updatedMiscField })
              }
              onMiscFieldRemove={() => setMiscFields(omit(miscFields, key))}
            />
          ))}
          <ButtonLight
            onClick={() =>
              setMiscFields({ ...miscFields, ...getDefaultMiscField() })
            }
          >
            Add miscellaneous field
          </ButtonLight>
        </div>

        <div className="flex flex-col items-center my-6">
          <ButtonPrimary
            type="submit"
            className={classNames({ "w-32": !isSaved })}
          >
            {!isSaving && !isSaved && "Save game"}
            {isSaving && <Spinner className="inline-block w-5 h-5" />}
            {isSaved && (
              <>
                <IconSmileyFace className="inline-block w-5 h-5 mr-2" />
                Game saved!
                <IconSmileyFace className="inline-block w-5 h-5 ml-2" />
              </>
            )}
          </ButtonPrimary>
        </div>
      </form>
    </ViewContentLayout>
  );
}

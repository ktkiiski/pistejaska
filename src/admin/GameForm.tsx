import { useNavigate } from "react-router-dom";
import React, { FormEvent, useState } from "react";
import EditGameBasicInfo from "./EditGameBasicInfo";
import {
  GameBasicInfoDefinition,
  GameDefinition,
  GameFieldDefinition,
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

interface GameEditViewProps {
  game?: GameDefinition;
}

interface KeyedScoreFields {
  [key: string]: GameScoreFieldDefinition;
}

interface KeyedMiscFields {
  [key: string]: GameMiscFieldDefinition;
}

function toKeyedFields<
  T extends GameFieldDefinition<number | string | string[]>
>(fields: T[]): { [key: string]: T } {
  return fields.reduce(
    (result, field) => ({ ...result, [crypto.randomUUID()]: field }),
    {}
  );
}

function getInitialBasicInfo(game?: GameDefinition): GameBasicInfoDefinition {
  return {
    id: game?.id ?? "",
    name: game?.name ?? "",
    icon: game?.icon ?? "",
    simultaneousTurns: game?.simultaneousTurns ?? false,
  };
}

function getInitialScoreFields(
  scoreFields?: GameScoreFieldDefinition[]
): KeyedScoreFields {
  const fields: GameScoreFieldDefinition[] =
    scoreFields && scoreFields?.length > 0
      ? scoreFields
      : [{ id: "", name: "", type: "number" }];
  return toKeyedFields(fields);
}

function getInitialMiscFields(
  miscFields?: GameMiscFieldDefinition[]
): KeyedMiscFields {
  return toKeyedFields(miscFields ?? []);
}

function getEmptyScoreField(): GameScoreFieldDefinition {
  return { id: "", name: "", type: "number" };
}

function getEmptyMiscField(): GameMiscFieldDefinition<string> {
  return { id: "", name: "", type: "text" };
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

export default function GameForm({ game }: GameEditViewProps) {
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState(() => getInitialBasicInfo(game));
  const [scoreFields, setScoreFields] = useState(() =>
    getInitialScoreFields(game?.scoreFields)
  );
  const [miscFields, setMiscFields] = useState(() =>
    getInitialMiscFields(game?.miscFields)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const addScoreField = () => {
    setScoreFields({
      ...scoreFields,
      [crypto.randomUUID()]: getEmptyScoreField(),
    });
  };

  const addMiscField = () => {
    setMiscFields({
      ...miscFields,
      [crypto.randomUUID()]: getEmptyMiscField(),
    });
  };

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
    <form onSubmit={onSave}>
      <fieldset disabled={isSaving || isSaved}>
        <div className="flex flex-col items-center pb-2 space-y-1">
          <EditGameBasicInfo
            basicInfo={basicInfo}
            onBasicInfoChange={(updatedBasicInfo) =>
              setBasicInfo({ ...basicInfo, ...updatedBasicInfo })
            }
          />
        </div>

        <Heading2 className="mt-6">Score fields</Heading2>
        <div className="flex flex-row flex-wrap gap-1.5 justify-center">
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
        </div>
        <div className="text-center mt-3">
          <ButtonLight onClick={addScoreField}>Add score field</ButtonLight>
        </div>

        <Heading2 className="mt-6">Miscellaneous fields</Heading2>
        <div className="flex flex-row flex-wrap gap-1.5 justify-center">
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
        </div>
        <div className="text-center mt-3">
          <ButtonLight onClick={addMiscField}>
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
      </fieldset>
    </form>
  );
}

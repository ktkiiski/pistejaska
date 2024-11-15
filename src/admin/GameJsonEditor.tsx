import { useEffect, useReducer, useRef, useState } from "react";
import { GameDefinition, schema } from "../domain/game";
import JsonEditor from "jsoneditor";
import Ajv from "ajv";
import { isEqual } from "lodash-es";
import "jsoneditor/dist/jsoneditor.css";
import useConfirmLeave from "../common/hooks/useConfirmLeave";
import ButtonDanger from "../common/components/buttons/ButtonDanger";
import ButtonPrimary from "../common/components/buttons/ButtonPrimary";

const ajv = new Ajv({ allErrors: true, verbose: true });

interface AdminGameEditorProps {
  json: GameDefinition;
  onSubmit: (json: GameDefinition) => void;
  onDelete: null | (() => void);
  submitButtonLabel: string;
}

function updateJson(
  oldJson: GameDefinition | null,
  newJson: GameDefinition | null,
): GameDefinition | null {
  return isEqual(newJson, oldJson) ? oldJson : newJson;
}

function GameJsonEditor({
  json,
  onSubmit,
  onDelete,
  submitButtonLabel,
}: AdminGameEditorProps) {
  const [inputJson, setInputJson] = useReducer(updateJson, json);
  const [outputJson, setOutputJson] = useState<GameDefinition | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => setInputJson(json), [json]);
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const editor = new JsonEditor(editorRef.current!, {
      mode: "code",
      ajv,
      schema,
      onChange: () => {
        try {
          setOutputJson(editor.get());
        } catch {
          setOutputJson(null);
        }
      },
      onValidationError: (errors) => {
        setIsValid(!errors.length);
      },
    });
    editor.set(inputJson);
    setIsValid(true);
    setOutputJson(inputJson);
    return () => editor.destroy();
  }, [inputJson]);
  const hasChanges = !isEqual(inputJson, outputJson);
  const isSubmitDisabled = !isValid || !outputJson || isLoading || !hasChanges;
  const isDeleteDisabled = !onDelete || isLoading;
  const onSubmitClick = async () => {
    if (!isSubmitDisabled && outputJson) {
      try {
        setIsLoading(true);
        await onSubmit(outputJson);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useConfirmLeave(hasChanges);

  return (
    <>
      <div className="h-[600px] mb-2" ref={editorRef} />
      <div>
        <ButtonPrimary disabled={isSubmitDisabled} onClick={onSubmitClick}>
          {submitButtonLabel}
        </ButtonPrimary>
        <ButtonDanger
          disabled={isDeleteDisabled}
          onClick={onDelete ?? undefined}
        >
          Delete game
        </ButtonDanger>
      </div>
    </>
  );
}

export default GameJsonEditor;

import { GameScoreFieldDefinition } from "../domain/game";
import InputTextField from "../common/components/inputs/InputTextField";
import InputNumberField from "../common/components/inputs/InputNumberField";
import ButtonDanger from "../common/components/buttons/ButtonDanger";

interface EditGameScoreFieldProps {
  scoreField: GameScoreFieldDefinition;
  onScoreFieldChange: (scoreField: GameScoreFieldDefinition) => void;
  onScoreFieldRemove: () => void;
  enableAutoFocus?: boolean;
}

export default function EditGameScoreField({
  scoreField,
  onScoreFieldChange,
  onScoreFieldRemove,
  enableAutoFocus = false,
}: EditGameScoreFieldProps) {
  const {
    name,
    description = "",
    minValue = null,
    maxValue = null,
    step = null,
  } = scoreField;

  const handleChange = (
    field: keyof GameScoreFieldDefinition,
    value: string | number | null
  ) => {
    onScoreFieldChange({ ...scoreField, [field]: value });
  };

  return (
    <div className="p-2 space-y-1 border-2 rounded-md border-blue-200 w-70 max-w-full">
      <InputTextField
        autoFocus={enableAutoFocus}
        label="Name"
        value={name}
        onChange={(value) => handleChange("name", value)}
      />
      <InputTextField
        label="Description"
        value={description}
        onChange={(value) => handleChange("description", value)}
      />
      <InputNumberField
        label={"Minimum value"}
        value={minValue}
        onChange={(value) => handleChange("minValue", value)}
      />
      <InputNumberField
        label={"Maximum value"}
        value={maxValue}
        onChange={(value) => handleChange("maxValue", value)}
      />
      <InputNumberField
        label="Step"
        value={step}
        onChange={(value) => handleChange("step", value)}
      />
      <div className="pt-2 text-center">
        <ButtonDanger onClick={onScoreFieldRemove}>Remove score field</ButtonDanger>
      </div>
    </div>
  );
}

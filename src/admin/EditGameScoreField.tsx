import { GameScoreFieldDefinition } from "../domain/game";
import InputTextField from "../common/components/inputs/InputTextField";
import InputNumberField from "../common/components/inputs/InputNumberField";
import ButtonDanger from "../common/components/buttons/ButtonDanger";

interface EditGameScoreFieldProps {
  scoreField: GameScoreFieldDefinition;
  onScoreFieldChange: (scoreField: GameScoreFieldDefinition) => void;
  onScoreFieldRemove: () => void;
}

export default function EditGameScoreField({
  scoreField,
  onScoreFieldChange,
  onScoreFieldRemove,
}: EditGameScoreFieldProps) {
  const {
    name,
    id,
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
    <div className="p-2 space-y-1 border-2 rounded-md border-blue-200">
      <InputTextField
        label={"Name"}
        value={name}
        onChange={(value) => handleChange("name", value)}
        className="w-60 max-w-full"
      />
      <InputTextField
        label={"Id"}
        value={id}
        onChange={(value) => handleChange("id", value)}
        className="w-60 max-w-full"
      />
      <InputTextField
        label={"Description"}
        value={description}
        onChange={(value) => handleChange("description", value)}
        className="w-60 max-w-full"
      />
      <InputNumberField
        label={"Minimum value"}
        value={minValue}
        onChange={(value) => handleChange("minValue", value)}
        className="w-60 max-w-full"
      />
      <InputNumberField
        label={"Maximum value"}
        value={maxValue}
        onChange={(value) => handleChange("maxValue", value)}
        className="w-60 max-w-full"
      />
      <InputNumberField
        label={"Step"}
        value={step}
        onChange={(value) => handleChange("step", value)}
        className="w-60 max-w-full"
      />
      <div className="pt-2 text-center">
        <ButtonDanger onClick={onScoreFieldRemove}>Remove</ButtonDanger>
      </div>
    </div>
  );
}

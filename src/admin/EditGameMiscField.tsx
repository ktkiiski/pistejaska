import { GameFieldOption, GameMiscFieldDefinition } from "../domain/game";
import NativeSelectField from "../common/components/inputs/NativeSelectField";
import InputTextField from "../common/components/inputs/InputTextField";
import InputNumberField from "../common/components/inputs/InputNumberField";
import ButtonDanger from "../common/components/buttons/ButtonDanger";
import EditOptions from "./EditOptions";

interface EditGameMiscFieldProps {
  miscField: GameMiscFieldDefinition;
  onMiscFieldChange: (miscField: GameMiscFieldDefinition) => void;
  onMiscFieldRemove: () => void;
}

export default function EditGameMiscField({
  miscField,
  onMiscFieldChange,
  onMiscFieldRemove,
}: EditGameMiscFieldProps) {
  const {
    type,
    name,
    id,
    description = "",
    options,
    minValue = null,
    maxValue = null,
    valuePerPlayer = false,
    affectsScoring = false,
    isRelevantReportDimension = false,
  } = miscField;

  const handleChange = (
    field: keyof GameMiscFieldDefinition,
    value: string | number | boolean | GameFieldOption<unknown>[] | null
  ) => {
    const updated = { ...miscField, [field]: value };
    if (field === "type" && value === "text") {
      delete updated.minValue;
      delete updated.maxValue;
    }
    onMiscFieldChange(updated);
  };

  return (
    <div className="p-2 space-y-1 border-2 rounded-md border-blue-200">
      <NativeSelectField
        label={"Type"}
        value={type}
        options={[
          { value: "text", label: "Text" },
          { value: "number", label: "Numeric" },
        ]}
        onChange={(value) => handleChange("type", value)}
        className="w-60 max-w-full"
      />
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
      {type === "number" && (
        <>
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
        </>
      )}
      <CheckboxField
        label={"Value per player"}
        checked={valuePerPlayer}
        onChange={(value) => handleChange("valuePerPlayer", value)}
        className="pt-2"
      />
      <CheckboxField
        label={"Affects scoring"}
        checked={affectsScoring}
        onChange={(value) => handleChange("affectsScoring", value)}
        className="pt-2"
      />
      <CheckboxField
        label={"Is relevant report dimension"}
        checked={isRelevantReportDimension}
        onChange={(value) => handleChange("isRelevantReportDimension", value)}
        className="pt-2"
      />
      {(type === "text" || type === "number") && (
        <EditOptions
          type={type}
          options={options as GameFieldOption<string | number>[]}
          onOptionsChange={(value) => handleChange("options", value)}
          className="mt-2"
        />
      )}
      <div className="pt-2 text-center">
        <ButtonDanger onClick={onMiscFieldRemove}>Remove</ButtonDanger>
      </div>
    </div>
  );
}

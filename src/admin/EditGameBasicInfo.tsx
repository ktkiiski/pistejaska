import InputTextField from "../common/components/inputs/InputTextField";
import { GameBasicInfoDefinition, GameDefinition } from "../domain/game";
import CheckboxField from "../common/components/inputs/CheckboxField";

interface EditGameBasicInfoProps {
  basicInfo: GameBasicInfoDefinition;
  onBasicInfoChange: (basicInfo: GameBasicInfoDefinition) => void;
}

export default function EditGameBasicInfo({ basicInfo, onBasicInfoChange }: EditGameBasicInfoProps) {
  const { name, icon, simultaneousTurns } = basicInfo;

  const handleChange = (
    field: keyof GameDefinition,
    value: string | boolean | null
  ) => {
    onBasicInfoChange({ ...basicInfo, [field]: value });
  };

  return (
    <div className="w-70 max-w-full">
      <InputTextField
        autoFocus
        required
        label="Name"
        value={name}
        onChange={(value) => handleChange("name", value)}
      />
      <InputTextField
        type="url"
        label={"Icon URL"}
        value={icon}
        onChange={(value) => handleChange("icon", value)}
      />
      <CheckboxField
        label={"Simultaneous turns"}
        checked={simultaneousTurns}
        onChange={(checked) => handleChange("simultaneousTurns", checked)}
        className="pt-2"
      />
    </div>
  );
}

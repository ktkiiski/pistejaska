import Heading3 from "../common/components/typography/Heading3";
import InputTextField from "../common/components/inputs/InputTextField";
import ButtonLight from "../common/components/buttons/ButtonLight";
import { GameFieldOption } from "../domain/game";
import InputNumberField from "../common/components/inputs/InputNumberField";
import classNames from "classnames";

interface EditOptionsProps<T = string | number> {
  type: "text" | "number";
  options?: GameFieldOption<T>[];
  onOptionsChange: (options: GameFieldOption<T>[]) => void;
  className: string;
  enableAutoFocus?: boolean;
}

export default function EditOptions({
  type,
  options,
  onOptionsChange,
  className,
  enableAutoFocus = false,
}: EditOptionsProps) {
  const addOption = () => {
    const value = type === "text" ? "" : 0;
    onOptionsChange([...(options ?? []), { value, label: "" }]);
  };

  const editOption = (option: GameFieldOption<unknown>, index: number) => {
    onOptionsChange(Object.assign([], options, { [index]: option }));
  };

  return (
    <div className={classNames(className, "space-y-1")}>
      {options && <Heading3>Options</Heading3>}
      {options?.map((option, i) => (
        <div className="p-1 border-2 rounded-md border-blue-100"
             key={i}>
          <InputTextField
            autoFocus={enableAutoFocus}
            label="Label"
            value={option.label}
            onChange={(label) => editOption({ ...option, label }, i)}
          />
          {type === "text" && (
            <InputTextField
              label="Value"
              value={option.value as string}
              onChange={(value) => editOption({ ...option, value }, i)}
            />
          )}
          {type === "number" && (
            <InputNumberField
              label="Value"
              value={option.value as number}
              onChange={(value) => editOption({ ...option, value }, i)}
            />
          )}
        </div>
      ))}
      <div className="pt-2 text-center">
        <ButtonLight onClick={addOption}>
          {options ? "Add option" : "Define options"}
        </ButtonLight>
      </div>
    </div>
  );
}

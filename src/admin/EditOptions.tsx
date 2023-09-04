import Heading3 from "../common/components/typography/Heading3";
import InputTextField from "../common/components/inputs/InputTextField";
import Button from "../common/components/buttons/Button";
import ButtonLight from "../common/components/buttons/ButtonLight";
import { GameFieldOption } from "../domain/game";
import InputNumberField from "../common/components/inputs/InputNumberField";
import classNames from "classnames";
import { sortBy } from "lodash";

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

  const deleteOption = (index: number) => {
    onOptionsChange((options ?? []).filter((_, i) => i !== index));
  };

  const editOption = (option: GameFieldOption<unknown>, index: number) => {
    onOptionsChange(Object.assign([], options, { [index]: option }));
  };

  const sortOptions = () => {
    onOptionsChange(sortBy(options, "label", "value"));
  };

  const separateValueField = type === "number";
  const borderClasses = "mt-1 p-1 border-2 rounded-md border-blue-100";

  return (
    <div className={className}>
      {options && <Heading3>Options</Heading3>}
      {options?.map((option, i) => (
        <div
          className={classNames({ [borderClasses]: separateValueField })}
          key={i}
        >
          <div className="relative">
            <Button
              onClick={() => deleteOption(i)}
              className={classNames("absolute sm:px-1 sm:py-0 z-10", {
                "-top-2 -right-2": separateValueField,
                "top-2 -right-0.5": !separateValueField,
              })}
            >
              X
            </Button>
          </div>
          <InputTextField
            autoFocus={enableAutoFocus}
            required
            label="Label"
            value={option.label}
            onChange={(label) => editOption({ ...option, label }, i)}
          />
          {separateValueField && (
            <InputNumberField
              required
              label="Value"
              value={option.value as number}
              onChange={(value) => editOption({ ...option, value }, i)}
            />
          )}
        </div>
      ))}
      <div className="pt-2 space-x-2 text-center">
        <ButtonLight onClick={addOption}>
          {options ? "Add option" : "Define options"}
        </ButtonLight>
        {options && options?.length > 0 && (
          <ButtonLight onClick={sortOptions}>Sort (A-Z)</ButtonLight>
        )}
      </div>
    </div>
  );
}

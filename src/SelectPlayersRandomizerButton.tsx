import { useState } from "react";
import Button from "./common/components/buttons/Button";
import ButtonGroup from "./common/components/buttons/ButtonGroup";
import DropdownMenu from "./common/components/dropdowns/DropdownMenu";

interface SelectPlayersRandomizerButtonProps {
  disabled: boolean;
  onRandomizeStartingPlayer: () => void;
  onRandomizeOrder: () => void;
}

export default function SelectPlayersRandomizerButton({
  onRandomizeStartingPlayer,
  onRandomizeOrder,
  disabled,
}: SelectPlayersRandomizerButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <ButtonGroup>
      <Button
        onClick={onRandomizeStartingPlayer}
        disabled={disabled}
        connectRight
      >
        Randomize starter
      </Button>
      <DropdownMenu
        isOpen={isDropdownOpen}
        options={[
          {
            value: "randomizeStartingPlayer",
            label: "Randomize starter",
            selected: true,
            disabled,
            onSelect: onRandomizeStartingPlayer,
          },
          {
            value: "randomizeOrder",
            label: "Shuffle seat order",
            disabled,
            onSelect: onRandomizeOrder,
          },
        ]}
        onSelect={() => setIsDropdownOpen(false)}
        onClose={() => setIsDropdownOpen(false)}
      >
        <div className="flex flex-row items-stretch">
          <Button
            disabled={disabled}
            connectLeft
            onClick={() => setIsDropdownOpen(true)}
          >
            ▼
          </Button>
        </div>
      </DropdownMenu>
    </ButtonGroup>
  );
}

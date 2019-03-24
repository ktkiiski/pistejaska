import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";

type GameDefinition = {
  name: string;
  id: string;
  icon: string;
  fields: GameFieldDefinition[];
};
type GameFieldDefinition = {
  id: string;
  name: string;
  type: "number" | "date" | "text";
  valuePerPlayer?: boolean; // defaults to true
  minValue?: number;
  maxValue?: number;
};
type Player = {
  name: string;
  id: string;
};

const terraFormingMars: GameDefinition = {
  name: "Terraforming Mars",
  id: "1",
  icon: "",
  fields: [
    { id: "1", name: "Terraforming rating", type: "number", minValue: 0 },
    { id: "2", name: "Awards", type: "number", minValue: 0 },
    { id: "3", name: "Milestones", type: "number", minValue: 0 },
    { id: "4", name: "Game board", type: "number", minValue: 0 },
    {
      id: "5",
      name: "Generations",
      type: "number",
      minValue: 0,
      valuePerPlayer: false
    }
  ]
};
const players = [
  { name: "Panu", id: "1" },
  { name: "Hanna", id: "2" },
  { name: "Kimmo", id: "3" },
  { name: "Hanna", id: "4" }
];

export const MarsForm = () => (
  <InputScoresForm game={terraFormingMars} players={players} />
);

type Scores = {
  gameId: string;
  scores: {
    playerId: string;
    fieldId: string;
    score: number;
  }[];
};

export const InputScoresForm = (props: {
  game: GameDefinition;
  players: Player[];
}) => {
  const [scores, scoreSetter] = React.useState<Scores>({
    gameId: props.game.id,
    scores: []
  });
  const [focusOnPlayerIndex, setFocusOnPlayerIndex] = useState<number>(0);

  const handleScoreChange = (
    event: React.FormEvent<HTMLInputElement>,
    field: GameFieldDefinition,
    player: Player
  ) => {
    const score = parseInt(event.currentTarget.value);
    const oldScores = scores.scores.filter(
      s => s.fieldId !== field.id || s.playerId !== player.id
    );
    const newScores = oldScores.concat({
      playerId: player.id,
      fieldId: field.id,
      score: score
    });

    scoreSetter({ ...scores, ...{ scores: newScores } });
  };

  const onFocus = (player: Player, field: GameFieldDefinition) => {
    setFocusOnPlayerIndex(props.players.indexOf(player));
  };
  let setFocus = false;
  const onSetFocusToNext = (field: GameFieldDefinition) => {
    if (focusOnPlayerIndex === props.players.length - 1) {
      setFocus = true;
      setFocusOnPlayerIndex(0);
      if (selectedFieldIndex < props.game.fields.length - 1) {
        setSelectedFieldIndex(selectedFieldIndex + 1);
      }
    } else {
      setFocusOnPlayerIndex(focusOnPlayerIndex + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: GameFieldDefinition
  ) => {
    if (
      e.keyCode == 9 || // android numpad enter/next button (tabulator in computer)
      e.keyCode == 13 // enter
    ) {
      onSetFocusToNext(field);
    }
  };
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);

  console.log(selectedFieldIndex);
  return (
    <div>
      <h2>{props.game.name}</h2>

      <SwipeableViews
        enableMouseEvents
        index={selectedFieldIndex}
        onChangeIndex={(newIndex, oldIndex) => {
          setSelectedFieldIndex(newIndex);
        }}
      >
        {props.game.fields.map((field, idx) => (
          <div key={field.name.replace(" ", "")}>
            <h3 id={field.id}>
              {idx + 1}. {field.name}
            </h3>

            {props.players.map(p => (
              <InputPlayerScoresForField
                player={p}
                field={field}
                scores={scores}
                onFocus={() => onFocus(p, field)}
                key={p.id}
                onKeyDown={e => handleKeyDown(e, field)}
                onHandleScoreChange={handleScoreChange}
                focusOnMe={
                  setFocus &&
                  players.length > focusOnPlayerIndex &&
                  p.id === players[focusOnPlayerIndex].id
                }
              />
            ))}

            <button
              onClick={() =>
                setSelectedFieldIndex(
                  selectedFieldIndex > 0 ? selectedFieldIndex - 1 : 0
                )
              }
            >
              &lt; Previous
            </button>
            <button
              onClick={() =>
                setSelectedFieldIndex(
                  selectedFieldIndex < props.game.fields.length - 1
                    ? selectedFieldIndex + 1
                    : props.game.fields.length - 1
                )
              }
            >
              Next &gt;
            </button>
          </div>
        ))}
      </SwipeableViews>
      <button>Save</button>
    </div>
  );
};

const InputPlayerScoresForField = (props: {
  player: Player;
  field: GameFieldDefinition;
  scores: Scores;
  onHandleScoreChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: GameFieldDefinition,
    player: Player
  ) => void;
  focusOnMe: boolean;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const {
    player,
    field,
    scores,
    onHandleScoreChange,
    focusOnMe,
    onFocus,
    onKeyDown
  } = props;

  useEffect(() => {
    if (focusOnMe) {
      if (inputRef != null && inputRef.current != null) {
        inputRef.current.focus();
      }
    }
  }, [focusOnMe]);

  return (
    <div key={player.id}>
      <label htmlFor={field.name.replace(" ", "_").concat(player.id)}>
        {player.name}
      </label>
      <input
        ref={inputRef}
        type={field.type}
        min={field.minValue}
        max={field.maxValue}
        onFocus={e => (!focusOnMe ? onFocus(e) : () => {})}
        onKeyDown={onKeyDown}
        value={
          ((scores.scores.find(
            s => s.fieldId === field.id && s.playerId === player.id
          ) || {}) as any).score || ""
        }
        onChange={e => onHandleScoreChange(e, field, player)}
        id={field.name.replace(" ", "_").concat(player.id)}
      />
    </div>
  );
};

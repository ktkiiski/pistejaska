import React, { useEffect, useState } from "react";
import useKey from "use-key-hook";

type GameDefinition = {
  name: string;
  id: string;
  icon: string;
  fields: GameFieldDefinition[];
};
type GameFieldDefinition = {
  id: string;
  name: string;
  type: "Number";
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
    { id: "1", name: "Terraforming rating", type: "Number", minValue: 0 },
    { id: "2", name: "Awards", type: "Number", minValue: 0 },
    { id: "3", name: "Milestones", type: "Number", minValue: 0 },
    { id: "4", name: "Game board", type: "Number", minValue: 0 }
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
  const [focusOnField, setFocusOnField] = useState<string>("");
  const [focusOnPlayerOfOrder, setFocusOnPlayerOfOrder] = useState<number>(0);
  console.log(scores);
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
  const getNextFieldId = (field: GameFieldDefinition) => {
    const indexOf = props.game.fields.indexOf(field);
    return (
      (props.game.fields[indexOf + 1] && props.game.fields[indexOf + 1].id) ||
      ""
    );
  };
  const getPreviousFieldId = (field: GameFieldDefinition) => {
    const indexOf = props.game.fields.indexOf(field);
    return (
      (props.game.fields[indexOf - 1] && props.game.fields[indexOf - 1].id) ||
      null
    );
  };
  const onNextClick = (field: GameFieldDefinition) => {
    setFocusOnPlayerOfOrder(0);
    setFocusOnField(getNextFieldId(field));
  };
  const onFocus = (player: Player, field: GameFieldDefinition) => {
    setFocusOnPlayerOfOrder(props.players.indexOf(player));
    setFocusOnField(field.id);
  };
  const onSetFocusOnNext = (field: GameFieldDefinition) => {
    if (focusOnPlayerOfOrder === props.players.length - 1) {
      setFocusOnField(getNextFieldId(field));
      setFocusOnPlayerOfOrder(0);
    } else {
      setFocusOnPlayerOfOrder(focusOnPlayerOfOrder + 1);
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
      onSetFocusOnNext(field);
    }
  };

  return (
    <div>
      <h2>{props.game.name}</h2>

      {props.game.fields.map(field => (
        <div key={field.name.replace(" ", "")}>
          <h3 id={field.id}>{field.name}</h3>
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
                focusOnField === field.id &&
                players.length > focusOnPlayerOfOrder &&
                p.id === players[focusOnPlayerOfOrder].id
              }
            />
          ))}
          <a href={"#" + getPreviousFieldId(field)}>&lt; Previous</a>
          <a onClick={() => onSetFocusOnNext(field)}>Next player</a>
          <a
            href={"#" + getNextFieldId(field)}
            onClick={() => onNextClick(field)}
          >
            Next &gt;
          </a>
        </div>
      ))}
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
      if (inputRef != null && inputRef.current != null)
        inputRef.current.focus();
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
        onFocus={onFocus}
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

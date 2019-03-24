import React, { useEffect, useState, useRef } from "react";
import SwipeableViews from "react-swipeable-views";
import classNames from "classnames";

import Button from "@material-ui/core/Button";
import {
  Typography,
  Grid,
  TextField,
  Input,
  InputBase
} from "@material-ui/core";
import {
  GameDefinition,
  Player,
  Scores,
  GameFieldDefinition,
  players
} from "./domain/domain";

export const InputScoresForm = (props: {
  game: GameDefinition;
  players: Player[];
}) => {
  const [scores, scoreSetter] = React.useState<Scores>({
    gameId: props.game.id,
    scores: []
  });
  const [focusOnPlayerIndex, setFocusOnPlayerIndex] = useState<number>(0);
  const saveButton = useRef<HTMLDivElement>(null);

  const handleScoreChange = (
    event: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const onSetFocusToNext = (field: GameFieldDefinition) => {
    if (focusOnPlayerIndex === props.players.length - 1) {
      setFocusOnPlayerIndex(0);
      if (selectedFieldIndex < props.game.fields.length - 1) {
        setSelectedFieldIndex(selectedFieldIndex + 1);
      } else {
        if (saveButton && saveButton.current) {
          setFocusOnPlayerIndex(-1);
          saveButton.current.focus(); // TODO PANU: useEffect?
        }
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

  const done =
    scores.scores.length === props.players.length * props.game.fields.length;

  let isSwitchingHack = false;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {props.game.name}
      </Typography>

      <SwipeableViews
        enableMouseEvents
        index={selectedFieldIndex}
        onChangeIndex={(newIndex, oldIndex) => {
          if (isSwitchingHack) setSelectedFieldIndex(newIndex);
          else setSelectedFieldIndex(oldIndex);
        }}
        onSwitching={idx => (isSwitchingHack = true)}
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
                onKeyDown={(e: any) => handleKeyDown(e, field)}
                onHandleScoreChange={handleScoreChange}
                focusOnMe={
                  selectedFieldIndex === props.game.fields.indexOf(field) &&
                  focusOnPlayerIndex >= 0 &&
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
      <Button
        variant="contained"
        color={done ? "primary" : "default"}
        buttonRef={saveButton}
      >
        Save
      </Button>
    </div>
  );
};

const InputPlayerScoresForField = (props: {
  player: Player;
  field: GameFieldDefinition;
  scores: Scores;
  onHandleScoreChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: GameFieldDefinition,
    player: Player
  ) => void;
  focusOnMe: boolean;
  onFocus: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
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

  const score = scores.scores
    .filter(s => s.playerId === player.id)
    .map(s => s.score)
    .reduce((s, memo) => s + memo, 0);

  const inputProps = {
    ref: inputRef,
    min: field.minValue,
    max: field.maxValue
  };

  return (
    <div key={player.id}>
      <TextField
        margin="dense"
        inputProps={inputProps}
        type={field.type}
        variant="outlined"
        label={player.name + " (" + score + " pts)"}
        onFocus={e => (focusOnMe ? () => {} : onFocus(e))}
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

import React, { useEffect, useState, useRef } from "react";
import SwipeableViews from "react-swipeable-views";

import Button from "@material-ui/core/Button";
import { Typography, TextField } from "@material-ui/core";
import {
  GameDefinition,
  Player,
  Play,
  GameFieldDefinition
} from "./domain/domain";
import * as firebase from "firebase/app";
import "firebase/firestore";

export const PlayForm = (props: {
  game: GameDefinition;
  play: Play;
  onSave: (id: string) => void;
}) => {
  const {
    play: { players },
    game
  } = props;

  const [play, setPlay] = React.useState<Play>(props.play);

  const [focusOnPlayerIndex, setFocusOnPlayerIndex] = useState<number>(0);
  const saveButton = useRef<HTMLDivElement>(null);

  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);

  const done = play.scores.length === players.length * game.fields.length;

  let isSwitchingHack = false;

  const handleScoreChange = (
    event: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: GameFieldDefinition,
    player: Player
  ) => {
    const score = parseInt(event.currentTarget.value);
    const oldScores = play.scores.filter(
      s => s.fieldId !== field.id || s.playerId !== player.id
    );
    const newScores = oldScores.concat({
      playerId: player.id,
      fieldId: field.id,
      score: score
    });

    setPlay(new Play({ ...play, ...{ scores: newScores } }));
  };

  const onFocus = (player: Player) => {
    setFocusOnPlayerIndex(players.indexOf(player));
  };

  const onSetFocusToNext = () => {
    if (focusOnPlayerIndex === players.length - 1) {
      setFocusOnPlayerIndex(0);
      if (selectedFieldIndex < game.fields.length - 1) {
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
      onSetFocusToNext();
    }
  };

  // TODO PANU: vie propseissa ylös?
  const onSave = () => {
    const db = firebase.firestore();
    db.collection("plays")
      .doc(play.id)
      .set({ data: JSON.stringify(play) });

    props.onSave(play.id);
  };
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {game.name}
      </Typography>

      <SwipeableViews
        enableMouseEvents
        index={selectedFieldIndex}
        onChangeIndex={(newIndex, oldIndex) => {
          if (isSwitchingHack) setSelectedFieldIndex(newIndex);
          else setSelectedFieldIndex(oldIndex);
        }}
        onSwitching={() => (isSwitchingHack = true)}
      >
        {game.fields.map((field, idx) => (
          <div key={field.name.replace(" ", "")}>
            <h3 id={field.id}>
              {idx + 1}. {field.name}
            </h3>

            {players.map(p => (
              <InputPlayerScoresForField
                player={p}
                field={field}
                scores={play}
                onFocus={() => onFocus(p)}
                key={p.id}
                onKeyDown={(e: any) => handleKeyDown(e, field)}
                onHandleScoreChange={handleScoreChange}
                focusOnMe={
                  selectedFieldIndex === game.fields.indexOf(field) &&
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
                  selectedFieldIndex < game.fields.length - 1
                    ? selectedFieldIndex + 1
                    : game.fields.length - 1
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
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  );
};

const InputPlayerScoresForField = (props: {
  player: Player;
  field: GameFieldDefinition;
  scores: Play;
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

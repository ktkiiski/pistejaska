import React, { useEffect, useState, useRef } from "react";
import SwipeableViews from "react-swipeable-views";
import Button from "@material-ui/core/Button";
import { Typography, TextField } from "@material-ui/core";
import {
  Game,
  Player,
  Play,
  GameScoreFieldDefinition,
  GameMiscFieldDefinition
} from "./domain/model";
import "firebase/firestore";

export const PlayForm = (props: {
  game: Game;
  play: Play;
  onSave: (play: Play) => void;
}) => {
  const {
    play: { players },
    game
  } = props;

  const [play, setPlay] = React.useState<Play>(props.play);

  const [focusOnPlayerIndex, setFocusOnPlayerIndex] = useState<number>(0);
  const saveButton = useRef<HTMLDivElement>(null);

  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);

  const done = play.scores.length === players.length * game.scoreFields.length;

  let isSwitchingHack = false;

  const fields = game.getFields();

  const handleScoreChange = (
    event: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: GameScoreFieldDefinition,
    player: Player
  ) => {
    let score = parseInt(event.currentTarget.value);
    if (score === NaN) return;
    if (field.maxValue === 0) score = -Math.abs(score);
    if (field.minValue === 0) score = Math.abs(score);

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

  const handleMiscChange = (
    event: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: GameScoreFieldDefinition
  ) => {
    const misc = event.currentTarget.value;
    const oldMisc = play.misc.filter(s => s.fieldId !== field.id);
    const newMisc = oldMisc.concat({
      fieldId: field.id,
      data: misc
    });

    setPlay(new Play({ ...play, ...{ misc: newMisc } }));
  };

  const onFocus = (player: Player) => {
    setFocusOnPlayerIndex(players.indexOf(player));
  };

  const onSetFocusToNext = () => {
    const field = game.scoreFields[selectedFieldIndex];
    const isMiscField = !field;
    const focusAtLastPlayer = focusOnPlayerIndex === players.length - 1;
    if (isMiscField || focusAtLastPlayer) {
      setFocusOnPlayerIndex(0);
      if (selectedFieldIndex < fields.length - 1) {
        setSelectedFieldIndex(selectedFieldIndex + 1);
      } else {
        if (saveButton && saveButton.current) {
          setFocusOnPlayerIndex(-1);
          saveButton.current.focus();
        }
      }
    } else {
      setFocusOnPlayerIndex(focusOnPlayerIndex + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
    field: GameScoreFieldDefinition
  ) => {
    if (
      e.keyCode == 9 || // android numpad enter/next button (tabulator in computer)
      e.keyCode == 13 // enter
    ) {
      onSetFocusToNext();
    }
  };

  const onSave = () => {
    props.onSave(play);
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
        {fields.map(({ field, type }, idx) => (
          <div key={field.name.replace(" ", "")}>
            <h3 id={field.id}>
              {idx + 1}. {field.name}
            </h3>

            {type === "misc" ? (
              <MetadataTextField
                field={field as GameMiscFieldDefinition}
                play={play}
                onFocus={e => {}}
                key={field.id}
                onKeyDown={e => handleKeyDown(e, field)}
                onHandleMiscChange={handleMiscChange}
                focusOnMe={
                  selectedFieldIndex === fields.map(f => f.field).indexOf(field)
                }
              />
            ) : (
              players.map(p => (
                <PlayerScoreTextField
                  player={p}
                  field={field}
                  scores={play}
                  onFocus={() => onFocus(p)}
                  key={p.id}
                  onKeyDown={e => handleKeyDown(e, field)}
                  onHandleScoreChange={handleScoreChange}
                  focusOnMe={
                    selectedFieldIndex === game.scoreFields.indexOf(field) &&
                    focusOnPlayerIndex >= 0 &&
                    p.id === players[focusOnPlayerIndex].id
                  }
                />
              ))
            )}

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
                  selectedFieldIndex < game.getFields().length - 1
                    ? selectedFieldIndex + 1
                    : game.getFields().length - 1
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

const PlayerScoreTextField = (props: {
  player: Player;
  field: GameScoreFieldDefinition;
  scores: Play;
  onHandleScoreChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: GameScoreFieldDefinition,
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

  const score =
    scores.scores
      .filter(s => s.playerId === player.id)
      .map(s => s.score)
      .reduce((s, memo) => s + memo, 0) || 0;

  const inputProps = {
    ref: inputRef,
    // min: field.minValue,
    // max: field.maxValue,
    step: field.step
  };

  const scoreItem = scores.scores.find(
    s => s.fieldId === field.id && s.playerId === player.id
  );
  const scoreValue = scoreItem ? scoreItem.score : "";

  return (
    <div key={player.id}>
      <TextField
        margin="dense"
        inputProps={inputProps}
        type="number"
        variant="outlined"
        label={player.name + " (" + score + " pts)"}
        onFocus={e => (focusOnMe ? () => {} : onFocus(e))}
        onKeyDown={onKeyDown}
        value={scoreValue}
        onChange={e => onHandleScoreChange(e, field, player)}
        id={field.name.replace(" ", "_").concat(player.id)}
      />
    </div>
  );
};
const MetadataTextField = (props: {
  field: GameMiscFieldDefinition;
  play: Play;
  onHandleMiscChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: GameScoreFieldDefinition
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
    field,
    play,
    onHandleMiscChange,
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

  const inputProps = {
    ref: inputRef,
    // min: field.minValue,
    // max: field.maxValue,
    step: field.step
  };

  return (
    <div key={field.id}>
      <TextField
        margin="dense"
        inputProps={inputProps}
        type={field.type}
        variant="outlined"
        label={field.name}
        onFocus={e => (focusOnMe ? () => {} : onFocus(e))}
        onKeyDown={onKeyDown}
        value={
          (play.misc.find(m => m.fieldId === field.id) || ({} as any)).data ||
          ""
        }
        onChange={e => onHandleMiscChange(e, field)}
      />
    </div>
  );
};

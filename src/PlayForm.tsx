import React, { useState, useRef } from "react";
import SwipeableViews from "react-swipeable-views";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { Player, Play } from "./domain/play";
import "firebase/firestore";
import {
  GameMiscFieldDefinition,
  GameScoreFieldDefinition,
  Game
} from "./domain/game";
import { PlayFormScoreField } from "./PlayFormScoreField";
import { PlayFormMiscField } from "./PlayFormMiscField";

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
    score: number | null,
    field: GameScoreFieldDefinition,
    player: Player
  ) => {
    const oldScores = play.scores.filter(
      s => s.fieldId !== field.id || s.playerId !== player.id
    );

    if (score == null) {
      setPlay(new Play({ ...play, ...{ scores: oldScores } }));
    } else {
      if (field.maxValue === 0) score = -Math.abs(score);
      if (field.minValue === 0) score = Math.abs(score);

      const newScores = oldScores.concat({
        playerId: player.id,
        fieldId: field.id,
        score: score
      });

      setPlay(new Play({ ...play, ...{ scores: newScores } }));
    }
  };

  const handleMiscChange = (
    misc: string,
    field: GameMiscFieldDefinition,
    player: Player | undefined
  ) => {
    const playerId = player && player.id;
    const oldMisc = play.misc.filter(
      s => s.fieldId !== field.id || s.playerId !== playerId
    );
    const newMisc = oldMisc.concat({
      fieldId: field.id,
      data: misc,
      playerId: playerId
    });

    setPlay(new Play({ ...play, ...{ misc: newMisc } }));
  };

  const onFocus = (player: Player) => {
    setFocusOnPlayerIndex(players.indexOf(player));
  };

  const onSetFocusToNext = () => {
    const field = game.getFields()[selectedFieldIndex];

    const fieldPerPlayer =
      field.type === "score" ||
      (field.field as GameMiscFieldDefinition).valuePerPlayer === true;
    const focusAtLastPlayer = focusOnPlayerIndex === players.length - 1;
    if (!fieldPerPlayer || focusAtLastPlayer) {
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
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>
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

  const renderMiscField = (field: GameMiscFieldDefinition) => {
    if (field.valuePerPlayer === true) {
      return players.map(p => (
        <PlayFormMiscField
          key={p.id}
          field={field}
          player={p}
          play={play}
          onFocus={() => onFocus(p)}
          onKeyDown={handleKeyDown}
          onChange={handleMiscChange}
          focusOnMe={
            selectedFieldIndex === fields.map(f => f.field).indexOf(field) &&
            focusOnPlayerIndex >= 0 &&
            p.id === players[focusOnPlayerIndex].id
          }
        />
      ));
    } else {
      return (
        <PlayFormMiscField
          field={field}
          play={play}
          onFocus={e => {}}
          player={undefined}
          key={field.id}
          onKeyDown={handleKeyDown}
          onChange={handleMiscChange}
          focusOnMe={
            selectedFieldIndex === fields.map(f => f.field).indexOf(field)
          }
        />
      );
    }
  };

  const renderScoreField = (field: GameScoreFieldDefinition) => {
    return players.map(p => (
      <PlayFormScoreField
        player={p}
        field={field}
        play={play}
        key={p.id}
        onFocus={() => onFocus(p)}
        onKeyDown={handleKeyDown}
        onChange={handleScoreChange}
        focusOnMe={
          selectedFieldIndex === game.scoreFields.indexOf(field) &&
          focusOnPlayerIndex >= 0 &&
          p.id === players[focusOnPlayerIndex].id
        }
      />
    ));
  };
  const onPreviousClick = () => {
    // Move to previous field
    setSelectedFieldIndex(selectedFieldIndex > 0 ? selectedFieldIndex - 1 : 0);
    // Reset focus to the first player
    setFocusOnPlayerIndex(0);
  };
  const onNextClick = () => {
    // Move to the next field
    setSelectedFieldIndex(
      selectedFieldIndex < gameFieldCount - 1
        ? selectedFieldIndex + 1
        : gameFieldCount - 1
    );
    // Reset focus to the first player
    setFocusOnPlayerIndex(0);
  };

  const gameFieldCount = game.getFields().length;
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
          <div key={field.id}>
            <h3 id={field.id}>
              {idx + 1}. {field.name}
            </h3>
            {field.description ? <p>{field.description}</p> : null}

            {type === "misc"
              ? renderMiscField(field as GameMiscFieldDefinition)
              : renderScoreField(field as GameScoreFieldDefinition)}

            <Button
              variant="outlined"
              color="default"
              disabled={selectedFieldIndex <= 0}
              onClick={onPreviousClick}
            >
              &lt; Previous
            </Button>
            <Button
              variant="outlined"
              color="default"
              disabled={selectedFieldIndex >= gameFieldCount - 1}
              onClick={onNextClick}
            >
              Next &gt;
            </Button>
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

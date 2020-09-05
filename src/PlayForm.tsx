import React, { useState, useRef } from "react";
import SwipeableViews from "react-swipeable-views";
import Button from "@material-ui/core/Button";
import { Checkbox, Typography } from "@material-ui/core";
import { Player, Play } from "./domain/play";
import "firebase/firestore";
import {
  Game,
  GameExpansionDefinition,
  GameMiscFieldDefinition,
  GameScoreFieldDefinition,
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
    game,
  } = props;

  const [play, setPlay] = React.useState<Play>(props.play);

  const [focusOnPlayerIndex, setFocusOnPlayerIndex] = useState<number>(0);
  const saveButton = useRef<HTMLDivElement>(null);

  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const selectedFieldIndex = game.hasExpansions()
    ? activeViewIndex - 1
    : activeViewIndex;

  const scoreFields = game.getScoreFields(play.expansions).map((f) => f.field);
  const done = play.scores.length === players.length * scoreFields.length;

  let isSwitchingHack = false;

  const fields = game.getFields(play.expansions);
  const viewCount = game.hasExpansions() ? fields.length + 1 : fields.length;

  const handleExpansionChange = (
    expansion: GameExpansionDefinition,
    selected: boolean
  ) => {
    if (selected && !play.expansions.includes(expansion.id)) {
      setPlay(
        new Play({
          ...play,
          expansions: play.expansions.concat(expansion.id),
        })
      );
    } else if (!selected && play.expansions.includes(expansion.id)) {
      const expansionScoreFieldIds = expansion.scoreFields.map(
        (field) => field.id
      );
      const expansionMiscFieldIds = (expansion.miscFields || []).map(
        (field) => field.id
      );
      setPlay(
        new Play({
          ...play,
          expansions: play.expansions.filter((id) => id !== expansion.id),
          // Omit score and misc fields from the removed expansion (in case they had already been filled)
          scores: play.scores.filter(
            (score) => !expansionScoreFieldIds.includes(score.fieldId)
          ),
          misc: play.misc.filter(
            (misc) => !expansionMiscFieldIds.includes(misc.fieldId)
          ),
        })
      );
    }
  };

  const handleScoreChange = (
    score: number | null,
    field: GameScoreFieldDefinition,
    player: Player
  ) => {
    const oldScores = play.scores.filter(
      (s) => s.fieldId !== field.id || s.playerId !== player.id
    );

    if (score === null) {
      setPlay(new Play({ ...play, ...{ scores: oldScores } }));
    } else {
      if (field.maxValue === 0) score = -Math.abs(score);
      if (field.minValue === 0) score = Math.abs(score);

      const newScores = oldScores.concat({
        playerId: player.id,
        fieldId: field.id,
        score: score,
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
      (s) => s.fieldId !== field.id || s.playerId !== playerId
    );
    const newMisc = oldMisc.concat({
      fieldId: field.id,
      data: misc,
      playerId: playerId,
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
      if (activeViewIndex < viewCount - 1) {
        setActiveViewIndex(activeViewIndex + 1);
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
      e.keyCode === 9 || // android numpad enter/next button (tabulator in computer)
      e.keyCode === 13 // enter
    ) {
      onSetFocusToNext();
    }
  };

  const onSave = () => {
    props.onSave(play);
  };

  const renderExpansionField = (expansion: GameExpansionDefinition) => (
    <div key={expansion.id}>
      <Checkbox
        checked={play.expansions.includes(expansion.id)}
        onChange={(_, checked) => handleExpansionChange(expansion, checked)}
      />
      {expansion.name}
    </div>
  );

  const renderMiscField = (field: GameMiscFieldDefinition) => {
    if (field.valuePerPlayer === true) {
      return players.map((p) => (
        <PlayFormMiscField
          key={p.id}
          field={field}
          player={p}
          play={play}
          onFocus={() => onFocus(p)}
          onKeyDown={handleKeyDown}
          onChange={handleMiscChange}
          focusOnMe={
            selectedFieldIndex === fields.map((f) => f.field).indexOf(field) &&
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
          onFocus={(e) => {}}
          player={undefined}
          key={field.id}
          onKeyDown={handleKeyDown}
          onChange={handleMiscChange}
          focusOnMe={
            selectedFieldIndex === fields.map((f) => f.field).indexOf(field)
          }
        />
      );
    }
  };

  const renderScoreField = (field: GameScoreFieldDefinition) => {
    return players.map((p) => (
      <PlayFormScoreField
        player={p}
        field={field}
        play={play}
        key={p.id}
        onFocus={() => onFocus(p)}
        onKeyDown={handleKeyDown}
        onChange={handleScoreChange}
        focusOnMe={
          selectedFieldIndex === scoreFields.indexOf(field) &&
          focusOnPlayerIndex >= 0 &&
          p.id === players[focusOnPlayerIndex].id
        }
      />
    ));
  };
  const onPreviousClick = () => {
    // Move to previous view
    setActiveViewIndex(activeViewIndex > 0 ? activeViewIndex - 1 : 0);
    // Reset focus to the first player
    setFocusOnPlayerIndex(0);
  };
  const onNextClick = () => {
    // Move to the next view
    setActiveViewIndex(
      activeViewIndex < viewCount - 1 ? activeViewIndex + 1 : viewCount - 1
    );
    // Reset focus to the first player
    setFocusOnPlayerIndex(0);
  };

  const views = [
    game.hasExpansions() && (
      <div>
        <h3>Used expansions</h3>
        {(game.expansions || []).map((expansion) =>
          renderExpansionField(expansion)
        )}
        <Button variant="outlined" color="default" onClick={onNextClick}>
          Next &gt;
        </Button>
      </div>
    ),
    ...fields.map((item, idx) => (
      <div key={item.field.id}>
        <h3 id={item.field.id}>
          {idx + 1}. {item.field.name}
        </h3>
        {item.field.description ? <p>{item.field.description}</p> : null}

        {item.type === "misc"
          ? renderMiscField(item.field)
          : renderScoreField(item.field)}

        <Button
          variant="outlined"
          color="default"
          disabled={activeViewIndex <= 0}
          onClick={onPreviousClick}
        >
          &lt; Previous
        </Button>
        <Button
          variant="outlined"
          color="default"
          disabled={activeViewIndex >= viewCount - 1}
          onClick={onNextClick}
        >
          Next &gt;
        </Button>
      </div>
    )),
  ].filter(Boolean);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {game.name}
      </Typography>

      <SwipeableViews
        enableMouseEvents
        index={activeViewIndex}
        onChangeIndex={(newIndex, oldIndex) => {
          if (isSwitchingHack) setActiveViewIndex(newIndex);
          else setActiveViewIndex(oldIndex);
        }}
        onSwitching={() => (isSwitchingHack = true)}
      >
        {views}
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

import React, { useState } from "react";
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
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { FormFocusGroup, FormFocusContextProvider } from "./utils/focus";

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
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const hasExpansions = game.hasExpansions();

  const scoreFields = game.getScoreFields(play.expansions).map((f) => f.field);
  const done = play.scores.length === players.length * scoreFields.length;

  let isSwitchingHack = false;

  const fields = game.getFields(play.expansions);
  const fieldGroupsById = groupBy(
    fields,
    ({ field }) => field.group ? `group:${field.group}` : `field:${field.id}`,
  );
  const fieldGroups = map(fieldGroupsById, (groupFields, viewId) => ({
    fields: groupFields, viewId,
  }));
  const startViewIndex = hasExpansions ? 1 : 0;
  const viewCount = startViewIndex + fieldGroups.length;

  let fieldCount = 0;
  function getNextFieldIndex(): number {
    const nextIndex = fieldCount;
    fieldCount += 1;
    return nextIndex;
  }

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
      const expansionScoreFieldIds = (expansion.scoreFields || []).map(
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

  const renderMiscField = (field: GameMiscFieldDefinition, viewIndex: number) => {
    if (field.valuePerPlayer === true) {
      return players.map((p, index) => (
        <PlayFormMiscField
          key={p.id}
          field={field}
          fieldIndex={getNextFieldIndex()}
          player={p}
          play={play}
          onFocus={() => {
            setActiveViewIndex(viewIndex);
            // onFocus(p);
          }}
          onChange={handleMiscChange}
        />
      ));
    } else {
      return (
        <PlayFormMiscField
          field={field}
          fieldIndex={getNextFieldIndex()}
          play={play}
          onFocus={() => {
            setActiveViewIndex(viewIndex);
          }}
          player={undefined}
          key={field.id}
          onChange={handleMiscChange}
        />
      );
    }
  };

  const renderScoreField = (field: GameScoreFieldDefinition, viewIndex: number) => {
    return players.map((p) => (
      <PlayFormScoreField
        player={p}
        field={field}
        fieldIndex={getNextFieldIndex()}
        play={play}
        key={p.id}
        onFocus={() => {
          setActiveViewIndex(viewIndex);
          // onFocus(p);
        }}
        onChange={handleScoreChange}
      />
    ));
  };
  const onPreviousClick = () => {
    // Move to previous view
    setActiveViewIndex(activeViewIndex > 0 ? activeViewIndex - 1 : 0);
  };
  const onNextClick = () => {
    // Move to the next view
    setActiveViewIndex(
      activeViewIndex < viewCount - 1 ? activeViewIndex + 1 : viewCount - 1
    );
  };

  const views = [
    hasExpansions && (
      <div key="expansions">
        <h3>Used expansions</h3>
        {(game.expansions || []).map((expansion) =>
          renderExpansionField(expansion)
        )}
        <Button variant="outlined" color="default" onClick={onNextClick}>
          Next &gt;
        </Button>
      </div>
    ),
    ...fieldGroups.map(({ fields: groupFields, viewId }, groupIndex) => (
      <div key={viewId}>
        <FormFocusGroup
          focused={activeViewIndex === startViewIndex + groupIndex}
        >
          {groupFields.map((item) => (
            <div key={item.field.id}>
              <h3 id={item.field.id}>
                {item.field.name}
              </h3>
              {item.field.description ? <p>{item.field.description}</p> : null}

              {item.type === "misc"
                ? renderMiscField(item.field, startViewIndex + groupIndex)
                : renderScoreField(item.field, startViewIndex + groupIndex)}
            </div>
          ))}
        </FormFocusGroup>

        <Button
          variant="outlined"
          color="default"
          disabled={activeViewIndex <= 0}
          onClick={onPreviousClick}
          // Skip from tab navigation
          tabIndex={-1}
        >
          &lt; Previous
        </Button>
        <Button
          variant="outlined"
          color="default"
          disabled={activeViewIndex >= viewCount - 1}
          onClick={onNextClick}
          // Skip from tab navigation
          tabIndex={-1}
        >
          Next &gt;
        </Button>
      </div>
    )),
  ].filter(Boolean);

  return (
    <FormFocusContextProvider>
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
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </FormFocusContextProvider>
  );
};

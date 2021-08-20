import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import Button from "@material-ui/core/Button";
import {
  Checkbox,
  Typography,
  FormControlLabel,
  FormGroup,
  makeStyles,
  ButtonGroup,
  Box,
} from "@material-ui/core";
import { Player, Play, UnsavedImage } from "./domain/play";
import {
  Game,
  GameExpansionDefinition,
  GameMiscFieldDefinition,
  GameScoreFieldDefinition,
} from "./domain/game";
import { PlayFormScoreField } from "./PlayFormScoreField";
import { PlayFormMiscField } from "./PlayFormMiscField";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import { FormFocusGroup, FormFocusContextProvider } from "./utils/focus";

const useStyles = makeStyles({
  heading: {
    margin: "0.5em 2em",
  },
  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "left",
  },
  description: {
    margin: "1em 2em",
    textAlign: "center",
  },
});

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
  const styles = useStyles();

  const scoreFields = game.getScoreFields(play.expansions).map((f) => f.field);
  const done = play.scores.length === players.length * scoreFields.length;

  let isSwitchingHack = false;

  const fields = game.getFields(play.expansions);
  const fieldGroupsById = groupBy(fields, ({ field }) =>
    field.group ? `group:${field.group}` : `field:${field.id}`
  );
  const fieldGroups = map(fieldGroupsById, (groupFields, viewId) => ({
    group: groupFields[0].field.group,
    fields: groupFields,
    viewId,
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

  const handleImageChange = (
    image: UnsavedImage,
    field: GameMiscFieldDefinition
  ) => {
    const newUnsavedImages = play.unsavedImages.concat(image);

    const oldValue = play.misc.find((x) => x.fieldId === field.id);
    const oldMisc = play.misc.filter((x) => x.fieldId !== field.id);

    const newMisc = oldMisc.concat({
      fieldId: field.id,
      data: ((oldValue?.data as string[]) || [])
        .filter(
          (x) => newUnsavedImages.find((y) => y.filename === x) === undefined
        )
        .concat(newUnsavedImages.map((x) => x.filename)),
    });

    setPlay(new Play({ ...play, ...{ misc: newMisc } }, newUnsavedImages));
  };

  const handleImageRemove = (
    filename: string,
    field: GameMiscFieldDefinition
  ) => {
    const newUnsavedImages = play.unsavedImages.filter(
      (x) => x.filename !== filename
    );

    const oldValue = play.misc.find((x) => x.fieldId === field.id);
    const oldMisc = play.misc.filter((x) => x.fieldId !== field.id);

    const newMisc = oldMisc.concat({
      fieldId: field.id,
      data: ((oldValue?.data as string[]) || []).filter((x) => x !== filename),
    });

    setPlay(new Play({ ...play, ...{ misc: newMisc } }, newUnsavedImages));
  };

  const onSave = () => {
    props.onSave(play);
  };

  const renderExpansionField = (expansion: GameExpansionDefinition) => (
    <FormControlLabel
      key={expansion.id}
      label={expansion.name}
      control={
        <Checkbox
          checked={play.expansions.includes(expansion.id)}
          onChange={(_, checked) => handleExpansionChange(expansion, checked)}
        />
      }
    />
  );

  const renderMiscField = (
    field: GameMiscFieldDefinition,
    viewIndex: number
  ) => {
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
          }}
          onChange={handleMiscChange}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
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
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
        />
      );
    }
  };

  const renderScoreField = (
    field: GameScoreFieldDefinition,
    viewIndex: number
  ) => {
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

  const renderButtons = (viewIndex: number) => (
    <Box marginTop={8}>
      <ButtonGroup variant="outlined" color="default">
        <Button
          disabled={viewIndex <= 0}
          onClick={() => setActiveViewIndex(Math.max(viewIndex - 1, 0))}
          // Skip from tab navigation
          tabIndex={-1}
        >
          &lt; Previous
        </Button>
        <Button
          variant={
            done || viewIndex >= viewCount - 1 ? "contained" : "outlined"
          }
          color="primary"
          onClick={onSave}
          // Skip from tab navigation, except on the final tab
          tabIndex={viewIndex < viewCount - 1 ? -1 : 0}
        >
          Save
        </Button>
        <Button
          disabled={viewIndex >= viewCount - 1}
          onClick={() =>
            setActiveViewIndex(Math.min(viewIndex + 1, viewCount - 1))
          }
          // Skip from tab navigation
          tabIndex={-1}
        >
          Next &gt;
        </Button>
      </ButtonGroup>
    </Box>
  );

  const views = [
    hasExpansions && (
      <div key="expansions" className={styles.view}>
        <h3 className={styles.heading}>Used expansions</h3>
        <FormGroup>
          {(game.expansions || []).map((expansion) =>
            renderExpansionField(expansion)
          )}
        </FormGroup>
        {renderButtons(0)}
      </div>
    ),
    ...fieldGroups.map(({ group, fields: groupFields, viewId }, groupIndex) => {
      const viewIndex = startViewIndex + groupIndex;
      return (
        <div key={viewId} className={styles.view}>
          {group ? <h3 className={styles.heading}>{group}</h3> : null}
          <FormFocusGroup focused={activeViewIndex === viewIndex}>
            {groupFields.map((item) => (
              <React.Fragment key={item.field.id}>
                {item.type === "misc" && group ? null : (
                  <h3 className={styles.heading} id={item.field.id}>
                    {item.field.name}
                  </h3>
                )}
                {item.field.description ? (
                  <p className={styles.description}>{item.field.description}</p>
                ) : null}

                {item.type === "misc"
                  ? renderMiscField(item.field, viewIndex)
                  : renderScoreField(item.field, viewIndex)}
              </React.Fragment>
            ))}
          </FormFocusGroup>
          {renderButtons(viewIndex)}
        </div>
      );
    }),
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
      </div>
    </FormFocusContextProvider>
  );
};

import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
} from "@material-ui/core";
import { Player, Play, PlayDTO } from "./domain/play";
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
import { TailwindContainerTitle } from "./common/components/Container";
import ViewContentLayout from "./common/components/ViewContentLayout";
import CardButtonRow from "./common/components/buttons/CardButtonRow";
import Button from "./common/components/buttons/Button";
import PrimaryButton from "./common/components/buttons/PrimaryButton";

const useStyles = makeStyles({
  heading: {
    margin: "0.5em 2em",
  },
  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "left",
    paddingBottom: "1em",
  },
  description: {
    margin: "1em 2em",
    textAlign: "center",
  },
});

export const PlayForm = (props: {
  game: Game;
  play: Play;
  className?: string;
  onImageUpload: (fieldId: string, file: File) => Promise<void>;
  onEdit: (changes: Partial<PlayDTO>) => void;
  onDone: () => void;
}) => {
  const { play, game, onEdit, onDone, onImageUpload, className } = props;
  const { players } = play;

  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const hasExpansions = game.hasExpansions();
  const styles = useStyles();

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
      onEdit({
        expansions: play.expansions.concat(expansion.id),
      });
    } else if (!selected && play.expansions.includes(expansion.id)) {
      const expansionScoreFieldIds = (expansion.scoreFields || []).map(
        (field) => field.id
      );
      const expansionMiscFieldIds = (expansion.miscFields || []).map(
        (field) => field.id
      );
      onEdit({
        expansions: play.expansions.filter((id) => id !== expansion.id),
        // Omit score and misc fields from the removed expansion (in case they had already been filled)
        scores: play.scores.filter(
          (score) => !expansionScoreFieldIds.includes(score.fieldId)
        ),
        misc: play.misc.filter(
          (misc) => !expansionMiscFieldIds.includes(misc.fieldId)
        ),
      });
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
      onEdit({ scores: oldScores });
    } else {
      if (field.maxValue === 0) score = -Math.abs(score);
      if (field.minValue === 0) score = Math.abs(score);

      const newScores = oldScores.concat({
        playerId: player.id,
        fieldId: field.id,
        score: score,
      });

      onEdit({ scores: newScores });
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
    let newMisc = playerId
      ? oldMisc.concat({
          fieldId: field.id,
          data: misc,
          playerId: playerId,
        })
      : oldMisc.concat({
          fieldId: field.id,
          data: misc,
        });

    onEdit({ misc: newMisc });
  };

  const handleImageRemove = (
    filename: string,
    field: GameMiscFieldDefinition
  ) => {
    // TODO: Actually delete images from storage?
    const oldValue = play.misc.find((x) => x.fieldId === field.id);
    const oldMisc = play.misc.filter((x) => x.fieldId !== field.id);

    const newMisc = oldMisc.concat({
      fieldId: field.id,
      data: ((oldValue?.data as string[]) || []).filter((x) => x !== filename),
    });

    onEdit({ misc: newMisc });
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
          onImageUpload={onImageUpload}
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
          onImageUpload={onImageUpload}
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

  const views = [
    hasExpansions && (
      <div key="expansions" className={styles.view}>
        <h3 className={styles.heading}>Used expansions</h3>
        <FormGroup>
          {(game.expansions || []).map((expansion) =>
            renderExpansionField(expansion)
          )}
        </FormGroup>
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
        </div>
      );
    }),
  ].filter(Boolean);

  return (
    <FormFocusContextProvider>
      <ViewContentLayout
        className={className}
        footer={
          <CardButtonRow>
            <Button
              disabled={activeViewIndex <= 0}
              onClick={() =>
                setActiveViewIndex(Math.max(activeViewIndex - 1, 0))
              }
              // Skip from tab navigation
              tabIndex={-1}
            >
              &lt; Previous
            </Button>
            <PrimaryButton
              color="primary"
              onClick={onDone}
              style={
                // TODO: Better visual effect to highlight the "Save" button when done
                activeViewIndex === viewCount - 1 ? undefined : { opacity: 0.8 }
              }
            >
              Done
            </PrimaryButton>
            <Button
              disabled={activeViewIndex >= viewCount - 1}
              onClick={() =>
                setActiveViewIndex(Math.min(activeViewIndex + 1, viewCount - 1))
              }
              // Skip from tab navigation
              tabIndex={-1}
            >
              Next &gt;
            </Button>
          </CardButtonRow>
        }
      >
        <TailwindContainerTitle>{game.name}</TailwindContainerTitle>
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
      </ViewContentLayout>
    </FormFocusContextProvider>
  );
};

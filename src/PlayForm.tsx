import React, { ReactNode, useState } from "react";
import { Player, Play, PlayDTO } from "./domain/play";
import {
  Game,
  GameExpansionDefinition,
  GameMiscFieldDefinition,
  GameScoreFieldDefinition,
  nameField,
} from "./domain/game";
import { PlayFormScoreField } from "./PlayFormScoreField";
import { PlayFormMiscField } from "./PlayFormMiscField";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import { FormFocusGroup, FormFocusContextProvider } from "./utils/focus";
import ViewContentLayout from "./common/components/ViewContentLayout";
import CardButtonRow from "./common/components/buttons/CardButtonRow";
import Button from "./common/components/buttons/Button";
import ButtonPrimary from "./common/components/buttons/ButtonPrimary";
import Heading1 from "./common/components/typography/Heading1";
import CheckboxField from "./common/components/inputs/CheckboxField";
import DropdownMenu, {
  DropdownMenuOption,
} from "./common/components/dropdowns/DropdownMenu";
import InputTextField from "./common/components/inputs/InputTextField";
import styles from "./PlayForm.module.css";
import SwipeableViews from "./lib/react-swipeable-views/src";

function FormViewHeading(props: {
  children: ReactNode;
  id?: string;
  options: DropdownMenuOption<number>[];
  onSelect: (index: number) => void;
}) {
  const { children, id, options, onSelect } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <Heading1 id={id} className="cursor-pointer">
      <DropdownMenu
        onClose={() => setIsDropdownOpen(false)}
        isOpen={isDropdownOpen}
        options={options}
        onSelect={(option) => {
          onSelect(option.value);
          setIsDropdownOpen(false);
        }}
        overlaySelectedOption
      >
        <span onClick={() => setIsDropdownOpen(true)}>
          {children}
          <span className="text-lg align-middle">{` ▼`}</span>
        </span>
      </DropdownMenu>
    </Heading1>
  );
}

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
    player?: Player | undefined
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
    <CheckboxField
      key={expansion.id}
      checked={play.expansions.includes(expansion.id)}
      onChange={(checked) => handleExpansionChange(expansion, checked)}
      label={expansion.name}
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

  const viewTitles: string[] = [];
  if (hasExpansions) {
    viewTitles.push("Used expansions");
  }
  viewTitles.push(
    ...fieldGroups.map(
      ({ group, fields: groupFields }) => group || groupFields[0].field.name
    )
  );
  const viewOptions = viewTitles.map<DropdownMenuOption<number>>(
    (title, index) => ({
      label: title,
      value: index,
      selected: index === activeViewIndex,
    })
  );

  const views = [
    hasExpansions && (
      <div
        key="expansions"
        className="flex flex-col items-center text-left pb-2"
      >
        <FormViewHeading options={viewOptions} onSelect={setActiveViewIndex}>
          Used expansions
        </FormViewHeading>
        <div className="flex flex-col items-stretch space-y-2">
          {(game.expansions || []).map((expansion) =>
            renderExpansionField(expansion)
          )}
        </div>
      </div>
    ),
    ...fieldGroups.map(({ group, fields: groupFields, viewId }, groupIndex) => {
      const viewIndex = startViewIndex + groupIndex;
      return (
        <div
          key={viewId}
          className="space-y-1 flex flex-col items-center text-left pb-2"
        >
          {group ? (
            <FormViewHeading
              options={viewOptions}
              onSelect={setActiveViewIndex}
            >
              {group}
            </FormViewHeading>
          ) : null}
          <FormFocusGroup focused={activeViewIndex === viewIndex}>
            {groupFields.map((item) => (
              <React.Fragment key={item.field.id}>
                {item.type === "misc" && group ? null : (
                  <FormViewHeading
                    id={item.field.id}
                    options={viewOptions}
                    onSelect={setActiveViewIndex}
                  >
                    {item.field.name}
                  </FormViewHeading>
                )}
                {item.field.description ? (
                  <p className="my-2 mx-2 text-center">
                    {item.field.description}
                  </p>
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
            <ButtonPrimary
              onClick={onDone}
              style={
                // TODO: Better visual effect to highlight the "Save" button when done
                activeViewIndex === viewCount - 1 ? undefined : { opacity: 0.8 }
              }
            >
              Done
            </ButtonPrimary>
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
        <InputTextField
          label={game.name}
          value={play.getMiscFieldValue(nameField) ?? ""}
          className={styles.editableHeading}
          centered
          unbordered
          onChange={(newName) => {
            handleMiscChange(newName, nameField);
          }}
        />
        <SwipeableViews
          enableMouseEvents
          index={activeViewIndex}
          onChangeIndex={(newIndex: number, oldIndex: number) => {
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

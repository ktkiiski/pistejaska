import { getTodayAsString } from "../common/dateUtils";
import { MiscDataDTO } from "./play";

export const durationField: GameMiscFieldDefinition<number> = {
  id: "duration",
  name: "Duration (in hours)",
  type: "number",
  step: 0.1,
};
export const locationField: GameMiscFieldDefinition<string> = {
  id: "location",
  name: "Location",
  type: "text",
};
export const nameField: GameMiscFieldDefinition<string> = {
  id: "name",
  name: "Name",
  type: "text",
};
export const dateField: GameMiscFieldDefinition<string> = {
  id: "date",
  name: "Date",
  type: "date",
  getDefaultValue: () => getTodayAsString(),
};

export class Game implements GameDefinition {
  name: string;
  id: string;
  icon: string;
  simultaneousTurns: boolean;
  scoreFields: GameScoreFieldDefinition[];
  miscFields?: GameMiscFieldDefinition[] | undefined;

  constructor(game: GameDefinition) {
    this.name = game.name;
    this.id = game.id;
    this.icon = game.icon;
    this.scoreFields = game.scoreFields;
    this.simultaneousTurns = game.simultaneousTurns;
    this.miscFields = game.miscFields;
    this.name = game.name;
  }

  public static getDefaultMiscFieldValues(): MiscDataDTO[] {
    return this.getDefaultMiscFields().map((f) => {
      return {
        fieldId: f.id,
        data: f.getDefaultValue ? f.getDefaultValue() : "",
      };
    });
  }
  private static getDefaultMiscFields(): GameMiscFieldDefinition[] {
    return [
      durationField,
      locationField,
      nameField,
      dateField,
    ];
  }

  private static getDefaultScoreFields(): GameScoreFieldDefinition[] {
    return [
      {
        id: "tie-breaker",
        name: "Tie breaker",
        type: "number",
        description:
          "Give a number that determines the winner in case of a tie",
      },
      {
        id: "misc",
        name: "Misc (unknown category)",
        type: "number",
        description:
          "Give scores that don't belong to any other category, eg. when playing new expansion",
      },
    ];
  }

  public getFields(): GameFieldItem[] {
    const { scoreFields, miscFields = [] } = this;
    return [
      ...scoreFields.map((f) => {
        return { type: "score", field: f } as const;
      }),
      ...Game.getDefaultScoreFields().map((f) => {
        return { type: "score", field: f } as const;
      }),
      ...miscFields.map((f) => {
        return { type: "misc", field: f } as const;
      }),
      ...Game.getDefaultMiscFields().map((f) => {
        return { type: "misc", field: f } as const;
      }),
    ];
  }
}
export type GameDefinition = {
  name: string;
  // please use human-readable, slugified ids, like "terraforming-mars". Do not change once created!
  id: string;
  icon: string;
  simultaneousTurns: boolean;
  scoreFields: GameScoreFieldDefinition[];
  miscFields?: GameMiscFieldDefinition[];
};

type GameFieldItem =
  | {
      type: "score";
      field: GameScoreFieldDefinition;
    }
  | {
      type: "misc";
      field: GameMiscFieldDefinition;
    };

export interface GameFieldOption<T> {
  value: T;
  label: string;
}

export interface GameFieldDefinition<T> {
  type: T extends number ? "number" : "date" | "text" | "boolean";
  // please use human-readable, slugified ids, like "terraforming-rating". Do not change once created!
  id: string;
  // A human-readable, short name for this field
  name: string;
  // A description how the field value should be calculated and entered
  description?: string;
  // If defined, then only allow choosing one of these values
  options?: Array<GameFieldOption<T>>;
  // The min, max and step values for the value. Only meaninful for numeric fields
  minValue?: T;
  maxValue?: T;
  step?: number;
}

export type GameScoreFieldDefinition = GameFieldDefinition<number>;

export interface GameMiscFieldDefinition<T = string | number> extends GameFieldDefinition<T> {
  valuePerPlayer?: boolean; // defaults to false
  getDefaultValue?: () => string;
  affectsScoring?: boolean; // defaults to false, used in reporting to define if scores should be be filterable by this field. e.g play location does not affect scoring, but used add-ons will affect
  isRelevantReportDimension?: boolean; // defaults to false, used in reporting to define if scores are grouped by this dimension, e.g. player race/class/corporation
};

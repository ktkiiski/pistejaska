import { groupBy, sum, sortBy } from "lodash";
import { getTodayAsString } from "../common/dateUtils";
import { MiscDataDTO } from "./play";

export class Game implements GameDefinition {
  name: string;
  id: string;
  icon: string;
  scoreFields: GameScoreFieldDefinition[];
  miscFields?: GameMiscFieldDefinition[] | undefined;

  constructor(game: GameDefinition) {
    this.name = game.name;
    this.id = game.id;
    this.icon = game.icon;
    this.scoreFields = game.scoreFields;
    this.miscFields = game.miscFields;
    this.name = game.name;
  }

  public static getDefaultMiscFieldValues(): MiscDataDTO[] {
    return this.getDefaultMiscFields().map(f => {
      return {
        fieldId: f.id,
        data: f.getDefaultValue ? f.getDefaultValue() : ""
      };
    });
  }
  private static getDefaultMiscFields(): GameMiscFieldDefinition[] {
    return [
      {
        id: "duration",
        name: "Duration (in hours)",
        type: "number",
        step: 0.1
      },
      {
        id: "location",
        name: "Location",
        type: "text"
      },
      {
        id: "name",
        name: "Name",
        type: "text"
      },
      {
        id: "date",
        name: "Date",
        type: "date",
        getDefaultValue: () => getTodayAsString()
      }
    ];
  }

  private static getDefaultScoreFields(): GameScoreFieldDefinition[] {
    return [
      {
        id: "tie-breaker",
        name: "Tie breaker",
        type: "number",
        description:
          "Give decimal scores (0.01) to tie-winning players to resolve ties",
        step: 0.01,
        maxValue: 0.1
      }
    ];
  }

  public getFields(): GameFieldItem[] {
    const { scoreFields, miscFields = [] } = this;
    return [
      ...scoreFields.map(f => {
        return { type: "score", field: f } as const;
      }),
      ...Game.getDefaultScoreFields().map(f => {
        return { type: "score", field: f } as const;
      }),
      ...miscFields.map(f => {
        return { type: "misc", field: f } as const;
      }),
      ...Game.getDefaultMiscFields().map(f => {
        return { type: "misc", field: f } as const;
      })
    ];
  }
}
export type GameDefinition = {
  name: string;
  // please use human-readable, slugified ids, like "terraforming-mars". Do not change once created!
  id: string;
  icon: string;
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
  type: T extends number ? "number" : "date" | "text";
  // please use human-readable, slugified ids, like "terraforming-rating". Do not change once created!
  id: string;
  // A human-readable, short name for this field
  name: string;
  // A description how the field value should be calculated and entered
  description?: string;
  // If defined, then only allow choosing one of these values
  options?: Array<GameFieldOption<T>>;
  // The min, max and step values for the value. Only meaninful for numerif fields
  minValue?: T;
  maxValue?: T;
  step?: number;
}

export type GameScoreFieldDefinition = GameFieldDefinition<number>;

export type GameMiscFieldDefinition = (
  | GameFieldDefinition<string>
  | GameFieldDefinition<number>) & {
  valuePerPlayer?: boolean; // defaults to false
  getDefaultValue?: () => string;
  // TODO PANU: add affectsScoring
};

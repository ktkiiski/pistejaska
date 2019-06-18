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
        step: "0.1"
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

  public getFields(): {
    type: string;
    field: GameScoreFieldDefinition | GameMiscFieldDefinition;
  }[] {
    return this.scoreFields
      .map(f => {
        return { type: "score", field: f };
      })
      .concat(
        (this.miscFields || []).map(f => {
          return { type: "misc", field: f };
        })
      )
      .concat(
        Game.getDefaultMiscFields().map(f => {
          return { type: "misc", field: f };
        })
      );
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

interface GameFieldDefinition {
  // please use human-readable, slugified ids, like "terraforming-rating". Do not change once created!
  id: string;
  // A human-readable, short name for this field
  name: string;
  // A description how the field value should be calculated and entered
  description?: string;
}

export interface GameScoreFieldDefinition extends GameFieldDefinition {
  minValue?: number;
  maxValue?: number;
  step?: string;
}

export interface GameMiscFieldDefinition extends GameFieldDefinition {
  type: "number" | "date" | "text";
  minValue?: number;
  maxValue?: number;
  step?: string;
  valuePerPlayer?: boolean; // defaults to false
  getDefaultValue?: () => string;
  // TODO PANU: add affectsScoring
}

import { groupBy, sum, sortBy } from "lodash";

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

  private getDefaultMiscFields(): GameMiscFieldDefinition[] {
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
        getDefaultValue: () => new Date().toISOString().substring(0, 10)
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
        this.getDefaultMiscFields().map(f => {
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

export type GameScoreFieldDefinition = {
  // please use human-readable, slugified ids, like "terraforming-rating". Do not change once created!
  id: string;
  name: string;
  minValue?: number;
  maxValue?: number;
  step?: string;
};

export type GameMiscFieldDefinition = {
  // please use human-readable, slugified ids, like "terraforming-rating". Do not change once created!
  id: string;
  name: string;
  type: "number" | "date" | "text";
  minValue?: number;
  maxValue?: number;
  step?: string;
  valuePerPlayer?: boolean; // defaults to false
  getDefaultValue?: () => number | string;
};

import { groupBy, sum, sortBy } from "lodash";
import uuid from "uuid";

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

  private getDefaultMiscFields() {
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
};
export type Player = {
  name: string;
  id: string;
};

export type PlayDTO = {
  id: string;
  date: Date;
  gameId: string;
  scores: {
    playerId: string;
    fieldId: string;
    score: number;
  }[];
  players: Player[];
  misc: { fieldId: string; data: string }[];
};

export class Play implements PlayDTO {
  misc: { fieldId: string; data: string }[];
  date: Date;
  id: string;
  gameId: string;
  scores: { playerId: string; fieldId: string; score: number }[];
  players: Player[];

  constructor(play: PlayDTO) {
    this.id = play.id;
    this.gameId = play.gameId;
    this.scores = play.scores || [];
    this.players = play.players || [];
    this.date = play.date || new Date();
    this.misc = play.misc || [];
  }

  public getPosition(player: Player) {
    const playersByScores = groupBy(this.scores, s => s.playerId);
    const playersByScore = Object.keys(playersByScores).map(p => {
      return { id: p, score: sum(playersByScores[p].map(p => p.score)) };
    });

    const id = player.id;
    const positions = sortBy(playersByScore, p => p.score)
      .map(p => p.id)
      .reverse();
    return positions.indexOf(id) + 1;
  }

  public getTotal(player: Player) {
    return sum(
      this.scores.filter(s => s.playerId === player.id).map(s => s.score)
    );
  }

  public getName(): string {
    const nameField = this.misc.find(m => m.fieldId === "name");
    const locationField = this.misc.find(m => m.fieldId === "location");
    const name =
      (nameField && nameField.data) ||
      (locationField && locationField.data) ||
      this.gameId;

    return name;
  }
}

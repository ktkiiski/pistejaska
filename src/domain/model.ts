import { groupBy, sum, sortBy } from "lodash";

export type GameDefinition = {
  name: string;
  // please use human-readable, slugified ids, like "terraforming-mars"
  id: string;
  icon: string;
  fields: GameFieldDefinition[];
};
// TODO PANU: should refactor to GameScoreFieldDefinition & GameMetadataFieldDefinition
export type GameFieldDefinition = {
  // please use human-readable, slugified ids, like "terraforming-rating"
  id: string;
  name: string;
  type: "number" | "date" | "text";
  valuePerPlayer: boolean; // defaults to true
  minValue?: number;
  maxValue?: number;
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
}

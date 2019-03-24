import { groupBy, sum, sortBy } from "lodash";

export type GameDefinition = {
  name: string;
  // please use human-readable, slugified ids, like "terraforming-mars"
  id: string;
  icon: string;
  fields: GameFieldDefinition[];
};
export type GameFieldDefinition = {
  // please use human-readable, slugified ids, like "terraforming-rating"
  id: string;
  name: string;
  type: "number" | "date" | "text";
  valuePerPlayer?: boolean; // defaults to true
  minValue?: number;
  maxValue?: number;
};
export type Player = {
  name: string;
  id: string;
};

const terraFormingMars: GameDefinition = {
  name: "Terraforming Mars",
  id: "terraforming-mars",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/sgZLoyg3KKeHvyHel8tZ2TIkXRw=/fit-in/900x600/filters:no_upscale()/pic3536616.jpg",
  fields: [
    { id: "1", name: "Terraforming rating", type: "number", minValue: 0 },
    { id: "2", name: "Awards", type: "number", minValue: 0 },
    { id: "3", name: "Milestones", type: "number", minValue: 0 },
    { id: "4", name: "Game board", type: "number", minValue: 0 },
    {
      id: "5",
      name: "Generations",
      type: "number",
      minValue: 0,
      valuePerPlayer: false
    }
  ]
};

const eclipse: GameDefinition = {
  name: "Eclipse",
  id: "eclipse",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/Ng0wVwl4xSa-MeOpuMaq1f7EwDs=/fit-in/246x300/pic1974056.jpg",
  fields: [
    { id: "karkit", name: "Karkkis", type: "number", minValue: 0 },
    { id: "game-board", name: "Game board", type: "number", minValue: 0 }
  ]
};

export const games = [terraFormingMars, eclipse];

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
};

export class Play implements PlayDTO {
  date: Date;
  id: string;
  gameId: string;
  scores: { playerId: string; fieldId: string; score: number }[];
  players: Player[];
  constructor(play: PlayDTO) {
    this.id = play.id;
    this.gameId = play.gameId;
    this.scores = play.scores;
    this.players = play.players;
    this.date = play.date;
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

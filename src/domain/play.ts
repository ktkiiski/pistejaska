import { groupBy, sum, sortBy } from "lodash";
export type Player = {
  name: string;
  id: string;
};

export type PlayDTO = {
  id: string;
  gameId: string;
  scores: {
    playerId: string;
    fieldId: string;
    score: number;
  }[];
  players: Player[];
  misc: MiscDataDTO[];
};

export type MiscDataDTO = {
  fieldId: string;
  data: string;
  playerId?: string | undefined;
};
export class Play implements PlayDTO {
  misc: MiscDataDTO[];
  id: string;
  gameId: string;
  scores: { playerId: string; fieldId: string; score: number }[];
  players: Player[];

  constructor(play: PlayDTO) {
    this.id = play.id;
    this.gameId = play.gameId;
    this.scores = play.scores || [];
    this.players = play.players || [];
    this.misc = play.misc || [];
  }

  public getPosition(player: Player) {
    const playersByScores = groupBy(this.scores, s => s.playerId);
    const playersByScore = Object.keys(playersByScores).map(p => {
      return {
        id: p,
        score: sum(playersByScores[p].map(p => p.score))
      };
    });

    const id = player.id;
    const positions = sortBy(playersByScore, p => p.score)
      .map(p => p.id)
      .reverse();
    return positions.indexOf(id) + 1;
  }

  public getTotal(player: Player) {
    return Math.floor(
      sum(this.scores.filter(s => s.playerId === player.id).map(s => s.score))
    );
  }

  public getDate(): Date {
    const dateField = this.misc.find(m => m.fieldId === "date");
    return (dateField && new Date(dateField.data)) || new Date("1900/01/01");
  }

  public getName(): string {
    const nameField = this.misc.find(m => m.fieldId === "name");
    const locationField = this.misc.find(m => m.fieldId === "location");
    const name =
      (nameField && nameField.data) ||
      (locationField && locationField.data) ||
      "";

    return `${this.getDate().toLocaleDateString()} ${name}`;
  }
}

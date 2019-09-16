import { groupBy, sum, sortBy, max } from "lodash";
export type Player = {
  name: string;
  id: string;
  elo?: number;
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
  created: string;
};

export type MiscDataDTO = {
  fieldId: string;
  data: string;
  playerId?: string | undefined;
};

// describes class that can be persisted
export abstract class Entity {
  public toDTO() {
    return JSON.parse(JSON.stringify(this));
  }
}
export class Play extends Entity implements PlayDTO {
  misc: MiscDataDTO[];
  id: string;
  gameId: string;
  scores: { playerId: string; fieldId: string; score: number }[];
  players: Player[];
  created: string;
  date: string;

  constructor(play: PlayDTO) {
    super();
    this.id = play.id;
    this.gameId = play.gameId;
    this.scores = play.scores || [];
    this.players = play.players || [];
    this.misc = play.misc || [];
    this.created = play.created || new Date().toISOString();
    const dateField = this.misc.find(m => m.fieldId === "date");
    this.date = dateField ? dateField.data : "";
  }

  public getPlayersByPosition() {
    const playerScores = sortBy(
      this.players.map(p => {
        return { player: p, scores: this.getTotal(p) };
      }),
      p => -p.scores
    );

    return playerScores.map(p => p.player);
  }

  // get position. Gives equal position to equal scores.
  public getPosition(player: Player) {
    const players = sortBy(
      this.players.map(p => {
        return { player: p, scores: this.getTotal(p) };
      }),
      p => -p.scores
    );

    let position = 0;
    let calculatedPosition = 0;
    let oldPlayerScores = -1;

    players.some(p => {
      calculatedPosition++;
      if (oldPlayerScores !== p.scores) {
        position = calculatedPosition;
      }
      oldPlayerScores = p.scores;

      // short-circuit, i.e. return from loop as soon as we find the player
      return p.player.id === player.id;
    });

    return position;
  }

  public getTotal(player: Player) {
    return Math.floor(
      sum(this.scores.filter(s => s.playerId === player.id).map(s => s.score))
    );
  }

  public getWinnerScores() {
    return max(this.players.map(p => this.getTotal(p)));
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

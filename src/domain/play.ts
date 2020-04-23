import { sum, sortBy, max } from "lodash";
import { GameMiscFieldDefinition } from "./game";
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

export interface PlayRanking {
  /**
   * A player in Play
   */
  player: Player;
  /**
   * Total score of the player
   */
  score: number;
  /**
   * Starting order position of the player, starting from 0.
   */
  index: number;
  /**
   * Position of the player in the final score, starting from 1 (winner).
   * May be equal to other positons if there are ties.
   */
  position: number;
  /**
   * Position of the player in the play normalized between 0 (winner) and 1 (loser).
   * Value is null if position cannot be determined (e.g. when tied)
   */
  normalizedPosition: number | null;
}

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
  rankings: PlayRanking[];

  constructor(play: PlayDTO) {
    super();
    this.id = play.id;
    this.gameId = play.gameId;
    this.scores = play.scores || [];
    this.players = play.players || [];
    this.misc = play.misc || [];
    this.created = play.created || new Date().toISOString();
    const dateField = this.misc.find((m) => m.fieldId === "date");
    this.date = dateField ? dateField.data : "";
    // Pre-sort players to the winning order, winner first
    const scoredPlayers = sortBy(
      this.players.map((player, index) => ({ player, index, score: this.getTotal(player) })),
      (p) => -p.score,
    );
    // Determine positions for each player, giving equal positions to equal scores.
    let latestPosition = 0;
    let latestScore = NaN;
    const rankings = scoredPlayers.map((ranking, index) => {
      const { score } = ranking;
      let position;
      if (score === latestScore) {
        // Tied with the previous player(s)
        position = latestPosition;
      } else {
        position = index + 1;
        latestScore = score;
        latestPosition = position;
      }
      return { ...ranking, position };
    });
    // Finally, calculate normalized positions for each player
    this.rankings = rankings.map(({ position, ...ranking }) => ({
      ...ranking,
      position,
      // Normalize between 0...1, unless everyone are tied
      normalizedPosition: latestPosition < 2 ? null : (position - 1) / (latestPosition - 1),
    }));
  }

  public getRanking(playerId: string): PlayRanking {
    const ranking = this.rankings.find(ranking => ranking.player.id === playerId);
    if (!ranking) {
      throw new Error(`Player with ID ${playerId} was not in this play`);
    }
    return ranking;
  }

  // get position. Gives equal position to equal scores.
  public getPosition(player: Player) {
    const ranking = this.rankings.find(ranking => ranking.player.id === player.id);
    return ranking ? ranking.position : NaN;
  }

  public getTotal(player: Player) {
    return Math.floor(
      sum(
        this.scores.filter((s) => s.playerId === player.id).map((s) => s.score)
      )
    );
  }

  public getWinnerScores(): number {
    return max(this.players.map((p) => this.getTotal(p))) || 0;
  }

  public getDate(): Date {
    const dateField = this.misc.find((m) => m.fieldId === "date");
    return (dateField && new Date(dateField.data)) || new Date("1900/01/01");
  }

  public getName(): string {
    const nameField = this.misc.find((m) => m.fieldId === "name");
    const locationField = this.misc.find((m) => m.fieldId === "location");
    const name =
      (nameField && nameField.data) ||
      (locationField && locationField.data) ||
      "";

    return `${this.getDate().toLocaleDateString()} ${name}`;
  }
}

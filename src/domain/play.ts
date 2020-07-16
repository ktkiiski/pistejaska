import { sortBy } from "lodash";
import { GameMiscFieldDefinition, nameField, locationField, dateField } from "./game";

export type Player = {
  name: string;
  id: string;
  elo?: number;
};

export type PlayDTO = {
  id: string;
  gameId: string;
  expansions: string[];
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
  data: string | number;
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
   * Starting order position of the player, normalized between 0 (started first)
   * and 1 (started last). Value is null for single-player games.
   */
  normalizedIndex: number | null;
  /**
   * Normalized score of this ranking, scaled between 0 (loser's score)
   * and 1 (winner's score). Value is null for single-player games.
   */
  normalizedScore: number | null;
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
  expansions: string[];
  scores: { playerId: string; fieldId: string; score: number }[];
  players: Player[];
  created: string;
  date?: string | null;
  rankings: PlayRanking[];

  constructor(play: PlayDTO) {
    super();
    this.id = play.id;
    this.gameId = play.gameId;
    this.expansions = play.expansions || [];
    this.scores = play.scores || [];
    this.players = play.players || [];
    this.misc = play.misc || [];
    this.created = play.created || new Date().toISOString();
    this.date = this.getMiscFieldValue(dateField);
    // Pre-sort players to the winning order, winner first
    const playerCount = this.players.length;
    const scoredPlayers = sortBy(
      this.players.map((player, index) => ({
        player,
        index,
        tieBreaker: this.getTieBreaker(player.id),
        normalizedIndex: playerCount > 1 ? index / (playerCount - 1) : null,
        score: this.getTotal(player.id),
      })),
      // Primarily sort by score
      (p) => -p.score,
      // Secondarily sort by tie-breaker
      (p) => -p.tieBreaker,
    );
    const maxScore = scoredPlayers[0]?.score;
    const minScore = scoredPlayers[scoredPlayers.length - 1]?.score;
    const scoreDiff = maxScore - minScore;
    // Determine positions for each player, giving equal positions to equal scores.
    let latestPosition = 0;
    let latestScore = NaN;
    let latestTieBreaker = NaN;
    const rankings = scoredPlayers.map((ranking, index) => {
      const { score, tieBreaker } = ranking;
      let position;
      if (score === latestScore && tieBreaker === latestTieBreaker) {
        // Tied with the previous player(s)
        position = latestPosition;
      } else {
        position = index + 1;
        latestScore = score;
        latestPosition = position;
        latestTieBreaker = tieBreaker;
      }
      return { ...ranking, position };
    });
    // Finally, calculate normalized positions for each player
    this.rankings = rankings.map(({ position, score, ...ranking }) => ({
      ...ranking,
      score,
      position,
      // Normalize position between 0...1, unless everyone are tied
      normalizedPosition: latestPosition < 2 ? null : (position - 1) / (latestPosition - 1),
      // Normalize score between 0...1, unless everyone are tied
      normalizedScore: scoreDiff > 0 ? (score - minScore) / scoreDiff : null,
    }));
  }

  public getRanking(playerId: string): PlayRanking | undefined {
    return this.rankings.find(ranking => ranking.player.id === playerId);
  }

  // get position. Gives equal position to equal scores.
  public getPosition(player: Player) {
    const ranking = this.rankings.find(ranking => ranking.player.id === player.id);
    return ranking ? ranking.position : NaN;
  }

  public getTieBreaker(playerId: string): number {
    const score = this.scores.find(
      score => score.fieldId === 'tie-breaker' && score.playerId === playerId
    );
    return score?.score || 0;
  }

  public getTotal(playerId: string) {
    return this.scores
      .filter(s => s.playerId === playerId && s.fieldId !== 'tie-breaker')
      .reduce((sum, s) => sum + (s.score || 0), 0);
  }

  public getWinnerScores(): number {
    return this.rankings[0]?.score || 0;
  }

  public getDate(): Date {
    const dateField = this.misc.find((m) => m.fieldId === "date");
    return (dateField && new Date(dateField.data)) || new Date("1900/01/01");
  }

  public getCreationDate(): Date {
    return new Date(this.created);
  }

  public getName(): string {
    const nameValue = this.getMiscFieldValue(nameField);
    const locationValue = this.getMiscFieldValue(locationField);
    const name = nameValue || locationValue || "";
    return `${this.getDate().toLocaleDateString()} ${name}`;
  }

  public getMiscFieldValue<T extends string | number>(field: GameMiscFieldDefinition<T>, playerId?: string): T | null | undefined {
    const item = this.misc.find(m => m.fieldId === field.id && m.playerId === playerId);
    const value = item?.data;
    if (value == null) {
      return value;
    }
    if (field.type === 'number' && typeof value === 'string') {
      const numberValue = parseFloat(value);
      return Number.isFinite(numberValue) ? numberValue as T : null;
    }
    return String(value) as T;
  }

  /**
   * Returns the duration of this game IN HOURS, if known.
   */
  public getDuration(): number | null {
    const field = this.misc.find(m => m.fieldId === 'duration');
    if (field && typeof field.data === 'number') {
      return field.data;
    }
    return null;
  }
}

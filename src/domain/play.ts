import {
  GameMiscFieldDefinition,
  nameField,
  locationField,
  dateField,
  imageField,
} from "./game";
import { rankScores } from "../common/rankings";
import { round } from "lodash";

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
  data: string | number | string[];
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

export type UnsavedImage = {
  file: File;
  filename: string;
  imageAsBase64: string;
};

// describes class that can be persisted
export class Play implements PlayDTO {
  misc: MiscDataDTO[];
  id: string;
  gameId: string;
  expansions: string[];
  scores: { playerId: string; fieldId: string; score: number }[];
  players: Player[];
  created: string;
  date?: string | null;
  rankings: PlayRanking[];
  unsavedImages: UnsavedImage[];

  constructor(play: PlayDTO, unsavedImages?: UnsavedImage[]) {
    // persisted values
    this.id = play.id;
    this.gameId = play.gameId;
    this.expansions = play.expansions || [];
    this.scores = play.scores || [];
    this.players = play.players || [];
    this.misc = play.misc || [];
    this.created = play.created || new Date().toISOString();

    // temporary values
    this.unsavedImages = unsavedImages || [];
    this.date = this.getMiscFieldValue(dateField);
    // Calculate normalized positions for each player
    this.rankings = rankScores(
      this.players.map((player, index) => ({
        player,
        score: this.getTotal(player.id),
        tieBreaker: this.getTieBreaker(player.id),
      }))
    );
  }

  public toDTO(): PlayDTO {
    return {
      id: this.id,
      gameId: this.gameId,
      expansions: this.expansions,
      scores: this.scores,
      players: this.players,
      misc: this.misc,
      created: this.created,
    };
  }

  public getImageUrl(filename: string) {
    return `https://firebasestorage.googleapis.com/v0/b/pistejaska-dev.appspot.com/o/play-images%2F${filename}?alt=media`;
  }

  public getImageUrls(): string[] {
    return this.getImages().map((x) => this.getImageUrl(x));
  }

  public getImages(): string[] {
    return this.getMiscFieldValue(imageField) || [];
  }

  public getExistingImages(): string[] {
    return this.getImages().filter(
      (x) => this.unsavedImages.find((y) => y.filename === x) === undefined
    );
  }

  public getRanking(playerId: string): PlayRanking | undefined {
    return this.rankings.find((ranking) => ranking.player.id === playerId);
  }

  // get position. Gives equal position to equal scores.
  public getPosition(playerId: string) {
    const ranking = this.rankings.find(
      (ranking) => ranking.player.id === playerId
    );
    return ranking ? ranking.position : NaN;
  }

  public getTieBreaker(playerId: string): number {
    const score = this.scores.find(
      (score) => score.fieldId === "tie-breaker" && score.playerId === playerId
    );
    return score?.score || 0;
  }

  public getTotal(playerId: string) {
    return this.scores
      .filter((s) => s.playerId === playerId && s.fieldId !== "tie-breaker")
      .reduce((sum, s) => sum + (s.score || 0), 0);
  }

  public getWinnerScores(): number {
    return this.rankings[0]?.score || 0;
  }

  public getDate(): Date {
    const dateField = this.misc.find((m) => m.fieldId === "date");
    return (
      (dateField && new Date(dateField.data as string)) ||
      new Date("1900/01/01")
    );
  }

  public getCreationDate(): Date {
    return new Date(this.created);
  }

  public getName(): string | null {
    const nameValue = this.getMiscFieldValue(nameField);
    const locationValue = this.getMiscFieldValue(locationField);
    const name =
      nameValue || locationValue || this.getDate().toLocaleDateString();

    return name;
  }

  public getDisplayName(): string {
    const nameValue = this.getMiscFieldValue(nameField);
    const locationValue = this.getMiscFieldValue(locationField);
    const name = nameValue ?? locationValue ?? "";
    return `${this.getDate().toLocaleDateString()} ${name}`;
  }

  public getLocation(): string {
    const locationValue = this.getMiscFieldValue(locationField);
    const name = locationValue ?? "";
    return `${name}`;
  }

  public getMiscFieldValue<T extends string | number | string[]>(
    field: GameMiscFieldDefinition<T>,
    playerId?: string
  ): T | null | undefined {
    const item = this.misc.find(
      (m) => m.fieldId === field.id && m.playerId === playerId
    );
    const value = item?.data;
    if (value == null) {
      return value;
    }
    if (field.type === "number" && typeof value === "string") {
      const numberValue = parseFloat(value);
      return Number.isFinite(numberValue) ? (numberValue as T) : null;
    }
    if (field.type === "images") {
      return (value as T) ?? ([] as any);
    }
    return String(value) as T;
  }

  public hasMiscFieldValue(
    fieldId: string,
    fieldValue: string | number
  ): boolean {
    return this.misc.some(
      // NOTE: Compare with "==" in case numbers are stringified
      // eslint-disable-next-line eqeqeq
      (m) => m.fieldId === fieldId && m.data == fieldValue
    );
  }

  /**
   * Returns the score value for the given player and score field ID.
   * Note that undefined score is returned as 0 instead of nully!
   * @param playerId ID of the player
   * @param fieldId optional score field ID
   */
  public getScoreFieldValue(playerId: string, fieldId: string): number {
    const score = this.scores.find(
      (item) => item.fieldId === fieldId && item.playerId === playerId
    );
    return score?.score ?? 0;
  }

  /**
   * Returns the duration of this game IN HOURS, if known.
   */
  public getDurationInHours(): number | null {
    const field = this.getDurationField();
    if (field && typeof field.data === "number") {
      return field.data;
    }
    return null;
  }

  private getDurationField(): MiscDataDTO | null {
    return this.misc.find((m) => m.fieldId === "duration") ?? null;
  }

  /**
   * Sets the duration of this game IN HOURS.
   */
  public setDurationInHours(durationInHours: number) {
    const field = this.getDurationField();
    if (field) {
      field.data = durationInHours;
    } else {
      console.warn("No duration field in play" + this.id);
    }
  }

  public getTimeInHoursSinceCreation(): number {
    const duration = new Date().getTime() - this.getCreationDate().getTime();
    const hours = duration / (1000 * 60 * 60);

    return round(hours, 1);
  }
}

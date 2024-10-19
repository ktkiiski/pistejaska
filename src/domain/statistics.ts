import { Play, PlayRanking } from "./play";
import { GameMiscFieldDefinition, GameFieldOption, Game } from "./game";

export interface GameStatistics {
  /**
   * The game for which these statistics are for.
   */
  game: Game;
  /**
   * For how many players this statistics are for.
   * Value `null` means "any number".
   */
  playerCount: number | null;
  /**
   * The total number of plays for this many players.
   */
  playCount: number;
  /**
   * The maximum winning score for this many players,
   * or null if information not available.
   */
  maxWinningScore: number | null;
  /**
   * The minimum winning score for this many players,
   * or null if information not available.
   */
  minWinningScore: number | null;
  /**
   * The average winning score for this many players,
   * or null if information not available.
   */
  averageWinningScore: number | null;
  /**
   * The sum of all winning scores for this many players.
   * Used to calculate the average winning score by dividing
   * this by `playCount`.
   */
  winningScoreSum: number;
  /**
   * The first game in which the winner got the `maxWinningScore`.
   */
  maxWinningScorePlay: Play | null;
  /**
   * The first game in which the winner got the `minWinningScore`.
   */
  minWinningScorePlay: Play | null;
  /**
   * Average duration of the game with this many players,
   * or null if information not available.
   */
  averageDuration: number | null;
  /**
   * Average duration of the game per player,
   * or null if information not available.
   */
  averageDurationPerPlayer: number | null;
  /**
   * The total number of playing minutes for this many players.
   * For average play duration: durationSum / durationCount
   * For average duration / player: durationSum / durationPlayerCount
   */
  durationSum: number;
  /**
   * The number of plays that had a duration information available,
   * for this many players.
   */
  durationCount: number;
  /**
   * The total number of players for duration information. Use this to
   * calculate the average duration per player.
   */
  durationPlayerCount: number;
  /**
   * Aggregated stats of other miscellaus non-player-specific dimensions.
   */
  dimensions: {
    [fieldId: string]: {
      minValue: number | null;
      maxValue: number | null;
      averageValue: number | null;
      valueSum: number;
      valueCount: number;
    };
  };
}

/**
 * Analyses the general statistics for a game for different number of players.
 * The index 0 in the returned array means "any number of players", and after
 * that each index corresponds the number of players attending the game.
 * @param game the game to analyze
 * @param plays all the plays for the game
 */
export function getGameStatistics(
  game: Game,
  plays: Play[],
  otherDimensions?: GameMiscFieldDefinition<number>[],
): GameStatistics[] {
  const initStats = (playerCount: number | null): GameStatistics => ({
    game,
    playerCount,
    playCount: 0,
    maxWinningScore: null,
    minWinningScore: null,
    averageWinningScore: null,
    winningScoreSum: 0,
    maxWinningScorePlay: null,
    minWinningScorePlay: null,
    averageDuration: null,
    averageDurationPerPlayer: null,
    durationSum: 0,
    durationCount: 0,
    durationPlayerCount: 0,
    dimensions: {},
  });

  const initDimension = () => ({
    minValue: null,
    maxValue: null,
    averageValue: null,
    valueSum: 0,
    valueCount: 0,
  });

  function aggregateWinningScore(
    stats: GameStatistics,
    winningScore: number,
    play: Play,
  ) {
    stats.playCount += 1;
    if (stats.maxWinningScore == null || winningScore > stats.maxWinningScore) {
      stats.maxWinningScore = winningScore;
      stats.maxWinningScorePlay = play;
    }
    if (stats.minWinningScore == null || winningScore < stats.minWinningScore) {
      stats.minWinningScore = winningScore;
      stats.minWinningScorePlay = play;
    }
    stats.winningScoreSum += winningScore;
    stats.averageWinningScore = stats.winningScoreSum / stats.playCount;
  }

  function aggregateDuration(
    stats: GameStatistics,
    playerCount: number,
    duration: number,
  ) {
    stats.durationSum += duration;
    stats.durationCount += 1;
    stats.durationPlayerCount += playerCount;
    stats.averageDuration = stats.durationSum / stats.durationCount;
    stats.averageDurationPerPlayer =
      stats.durationSum / stats.durationPlayerCount;
  }

  function aggregateOtherDimension(
    stats: GameStatistics,
    field: GameMiscFieldDefinition<number>,
    value: number,
  ) {
    const dimension = stats.dimensions[field.id] ?? initDimension();
    stats.dimensions[field.id] = dimension;
    if (dimension.maxValue == null || value > dimension.maxValue) {
      dimension.maxValue = value;
    }
    if (dimension.minValue == null || value < dimension.minValue) {
      dimension.minValue = value;
    }
    dimension.valueCount += 1;
    dimension.valueSum += value;
    dimension.averageValue = dimension.valueSum / dimension.valueCount;
  }

  const anyPlayerStats = initStats(null);
  const statsByPlayerCount: GameStatistics[] = [anyPlayerStats];
  plays.forEach((play) => {
    const playerCount = play.rankings.length;
    const playerCountStats =
      statsByPlayerCount[playerCount] || initStats(playerCount);
    statsByPlayerCount[playerCount] = playerCountStats;
    const [win] = play.rankings;
    aggregateWinningScore(anyPlayerStats, win.score, play);
    aggregateWinningScore(playerCountStats, win.score, play);

    const duration = play.getDurationInHours();
    if (duration != null) {
      aggregateDuration(anyPlayerStats, playerCount, duration);
      aggregateDuration(playerCountStats, playerCount, duration);
    }
    // Aggregate other dimensions
    otherDimensions?.forEach((field) => {
      const value = play.getMiscFieldValue(field);
      if (value != null) {
        aggregateOtherDimension(anyPlayerStats, field, value);
        aggregateOtherDimension(playerCountStats, field, value);
      }
    });
  });
  return statsByPlayerCount.filter((stats) => stats != null);
}

export interface GamePlayerStatistics {
  /**
   * The game for which these statistics are for.
   */
  game: Game;
  /**
   * The player ID for whom these statistics are for.
   */
  playerId: string;
  /**
   * The total number of plays for this player,
   * where NOT playing alone.
   */
  playCount: number;
  /**
   * The total number of times the player has won the game.
   */
  winCount: number;
  /**
   * The average normalized ranking position of the player in games,
   * or null if unavailable.
   */
  averageNormalizedPosition: number | null;
  /**
   * The sum for normalized positions, used to calculate the average.
   */
  normalizedPositionSum: number;
  /**
   * The maximum winning score for this player,
   * or null if information not available.
   */
  maxWinningScore: number | null;
  /**
   * The minimum winning score for this player,
   * or null if information not available.
   */
  minWinningScore: number | null;
  /**
   * The average winning score for this player,
   * or null if information not available.
   */
  averageWinningScore: number | null;
  /**
   * The sum of all winning scores for this player.
   * Used to calculate the average winning score by dividing
   * this by `playCount`.
   */
  winningScoreSum: number;
  /**
   * The first game in which the player got the `maxWinningScore`.
   */
  maxWinningScorePlay: Play | null;
  /**
   * The first game in which the player got the `minWinningScore`.
   */
  minWinningScorePlay: Play | null;
  /**
   * Aggregated stats of other miscellaus player-specific dimensions.
   */
  dimensions: {
    [fieldId: string]: {
      minValue: number | null;
      maxValue: number | null;
      averageValue: number | null;
      valueSum: number;
      valueCount: number;
    };
  };
}

/**
 * Analyses the statistics for a game for the given player.
 * @param game the game to analyze
 * @param plays all the plays for the game
 */
export function getGamePlayerStatistics(
  game: Game,
  plays: Play[],
  playerId: string,
  otherDimensions?: GameMiscFieldDefinition<number>[],
): GamePlayerStatistics {
  const initDimension = () => ({
    minValue: null,
    maxValue: null,
    averageValue: null,
    valueSum: 0,
    valueCount: 0,
  });

  function aggregateRanking(
    stats: GamePlayerStatistics,
    ranking: PlayRanking,
    play: Play,
  ) {
    const { normalizedPosition } = ranking;
    if (normalizedPosition != null) {
      stats.playCount += 1;
      stats.normalizedPositionSum += normalizedPosition;
      stats.averageNormalizedPosition =
        stats.normalizedPositionSum / stats.playCount;
      if (normalizedPosition === 0) {
        const winningScore = ranking.score;
        stats.winCount += 1;
        if (
          stats.maxWinningScore == null ||
          winningScore > stats.maxWinningScore
        ) {
          stats.maxWinningScore = winningScore;
          stats.maxWinningScorePlay = play;
        }
        if (
          stats.minWinningScore == null ||
          winningScore < stats.minWinningScore
        ) {
          stats.minWinningScore = winningScore;
          stats.minWinningScorePlay = play;
        }
        stats.winningScoreSum += winningScore;
        stats.averageWinningScore = stats.winningScoreSum / stats.winCount;
      }
    }
  }

  function aggregateOtherDimension(
    stats: GamePlayerStatistics,
    field: GameMiscFieldDefinition<number>,
    value: number,
  ) {
    const dimension = stats.dimensions[field.id] ?? initDimension();
    stats.dimensions[field.id] = dimension;
    if (dimension.maxValue == null || value > dimension.maxValue) {
      dimension.maxValue = value;
    }
    if (dimension.minValue == null || value < dimension.minValue) {
      dimension.minValue = value;
    }
    dimension.valueCount += 1;
    dimension.valueSum += value;
    dimension.averageValue = dimension.valueSum / dimension.valueCount;
  }

  const playerStats: GamePlayerStatistics = {
    game,
    playerId,
    playCount: 0,
    winCount: 0,
    averageNormalizedPosition: null,
    normalizedPositionSum: 0,
    maxWinningScore: null,
    minWinningScore: null,
    averageWinningScore: null,
    winningScoreSum: 0,
    maxWinningScorePlay: null,
    minWinningScorePlay: null,
    dimensions: {},
  };
  plays.forEach((play) => {
    const { rankings } = play;
    const ranking = rankings.find((r) => r.player.id === playerId);
    if (!ranking) {
      // Player not in this play
      return;
    }
    aggregateRanking(playerStats, ranking, play);

    // Aggregate other dimensions
    otherDimensions?.forEach((field) => {
      const value = play.getMiscFieldValue(field, playerId);
      if (value != null) {
        aggregateOtherDimension(playerStats, field, value);
      }
    });
  });
  return playerStats;
}

export interface DimensionValueStatistics<T> {
  /**
   * The dimension being analyzed.
   */
  dimension: GameMiscFieldDefinition<T>;
  /**
   * The value of the dimension.
   */
  option: GameFieldOption<T>;
  /**
   * How many times this dimension value was used IN TOTAL in the original set of plays.
   * Note that this is NOT the number of plays and could even be larger, if the option
   * was used more than once in each play.
   */
  useCount: number;
  /**
   * How many times this dimension value was used in any play in the original set of plays.
   * This is the distinct number of plays, so multiple uses in the same play are ignored.
   */
  playCount: number;
  /**
   * How many times this value was used by a winning player
   */
  winCount: number;
  /**
   * The average ranking of the player using this value in all plays.
   * This is normalized between 0...1 where 0 means WINNER and 1 means LOSER.
   * Value is null normalized position cannot be calculated.
   */
  averageNormalizedPosition: number | null;
  /**
   * The sum of normalized rankings players using this value in any play.
   * Used just to calculate `averageNormalizedPosition`.
   */
  normalizedPositionSum: number;
  /**
   * The total number of times this value was counted as a normalized ranking.
   * Used just to calculate `averageNormalizedPosition`.
   */
  normalizedPositionCount: number;
}

/**
 * Analyses a dimension from the given array of game plays.
 * Returns aggregated information about each known value of the dimension.
 */
export function getDimensionStatistics(
  plays: Play[],
  dimension: GameMiscFieldDefinition<string>,
  reportPlayerId?: string,
): Map<string, DimensionValueStatistics<string>> {
  const statsByValue = new Map<string, DimensionValueStatistics<string>>();
  const playIdsByValue = new Map<string, Set<string>>();

  const initValueStats = (option: GameFieldOption<string>) => ({
    dimension,
    option,
    useCount: 0,
    playCount: 0,
    winCount: 0,
    averageNormalizedPosition: null,
    normalizedPositionSum: 0,
    normalizedPositionCount: 0,
  });

  // Initialize the stats with the known option values
  dimension.options?.forEach((option) => {
    statsByValue.set(option.value, initValueStats(option));
  });
  // Go through all the games once and aggregate the stats for each value
  plays.forEach((play) => {
    play.misc.forEach(({ fieldId, playerId, data }) => {
      // Skip if reporting for a specific player and this is not for them
      if (reportPlayerId != null && playerId !== reportPlayerId) return;
      if (typeof data === "string" && fieldId === dimension.id) {
        let stats = statsByValue.get(data);
        if (!stats) {
          // Encountered a new value!
          stats = initValueStats({ value: data, label: data });
          statsByValue.set(data, stats);
        }
        // Was used in the play
        stats.useCount += 1;
        // Track the distinct number of plays where this value was used at least onces
        let playIds = playIdsByValue.get(data);
        if (!playIds) {
          playIds = new Set<string>();
          playIdsByValue.set(data, playIds);
        }
        playIds.add(play.id);
        stats.playCount = playIds.size;

        if (playerId != null) {
          // Check if used by a winner
          const playerRanking = play.getRanking(playerId);
          if (playerRanking) {
            if (playerRanking.position === 1) {
              stats.winCount += 1;
            }
            // Average normalized position
            if (playerRanking.normalizedPosition != null) {
              stats.normalizedPositionSum += playerRanking.normalizedPosition;
              stats.normalizedPositionCount += 1;
              stats.averageNormalizedPosition =
                stats.normalizedPositionSum / stats.normalizedPositionCount;
            }
          } else {
            console.warn(
              `Play ${play.id} probably corrupt: player with ID ${playerId} was not in this play`,
            );
          }
        }
      }
    });
  });
  return statsByValue;
}

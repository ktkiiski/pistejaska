import { Play } from "./play";
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
}

/**
 * Analyses the general statistics for a game for different number of players.
 * The index 0 in the returned array means "any number of players", and after
 * that each index corresponds the number of players attending the game.
 * @param game the game to analyze
 * @param plays all the plays for the game
 */
export function getGameStatistics(game: Game, plays: Play[]): GameStatistics[] {
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
    });

    function aggregateWinningScore(stats: GameStatistics, winningScore: number, play: Play) {
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

    function aggregateDuration(stats: GameStatistics, playerCount: number, duration: number) {
        stats.durationSum += duration;
        stats.durationCount += 1;
        stats.durationPlayerCount += playerCount;
        stats.averageDuration = stats.durationSum / stats.durationCount;
        stats.averageDurationPerPlayer = stats.durationSum / stats.durationPlayerCount;
    }

    const anyPlayerStats = initStats(null);
    const statsByPlayerCount: GameStatistics[] = [anyPlayerStats];
    plays.forEach((play) => {
        const playerCount = play.rankings.length;
        let playerCountStats = statsByPlayerCount[playerCount] || initStats(playerCount);
        statsByPlayerCount[playerCount] = playerCountStats;
        const [ win ] = play.rankings;
        aggregateWinningScore(anyPlayerStats, win.score, play);
        aggregateWinningScore(playerCountStats, win.score, play);

        const duration = play.getDuration();
        if (duration != null) {
            aggregateDuration(anyPlayerStats, playerCount, duration);
            aggregateDuration(playerCountStats, playerCount, duration);
        }
    });
    return statsByPlayerCount.filter(stats => stats != null);
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
     * How many times this dimension value was used in the original set of plays.
     */
    count: number;
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
): Map<string, DimensionValueStatistics<string>> {
    const statsByValue = new Map<string, DimensionValueStatistics<string>>();

    const initValueStats = (option: GameFieldOption<string>) => ({
        dimension,
        option,
        count: 0,
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
            if (typeof data === 'string' && fieldId === dimension.id) {
                let stats = statsByValue.get(data);
                if (!stats) {
                    // Encountered a new value!
                    stats = initValueStats({ value: data, label: data });
                    statsByValue.set(data, stats);
                }
                // Was used in the play
                stats.count += 1;
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
                            stats.averageNormalizedPosition = stats.normalizedPositionSum / stats.normalizedPositionCount;
                        }
                    } else {
                        console.warn(`Play ${play.id} probably corrupt: player with ID ${playerId} was not in this play`);
                    }
                }
            }
        });
    });
    return statsByValue;
}
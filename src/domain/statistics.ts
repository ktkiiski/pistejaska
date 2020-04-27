import { Play } from "./play";
import { GameMiscFieldDefinition, GameFieldOption } from "./game";

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
            if (fieldId === dimension.id) {
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
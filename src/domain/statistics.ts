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
}

/**
 * Analyses a dimension from the given array of game plays.
 * Returns aggregated information about each possible value of the dimension.
 */
export function getDimensionStatistics(
    plays: Play[],
    dimension: GameMiscFieldDefinition<string>,
): DimensionValueStatistics<string>[] {
    const options = dimension.options ?? [];
    return options.map((option) => {
        const { value } = option;
        let count = 0;
        let winCount = 0;
        let normalizedPositionSum = 0;
        let normalizedPositionCount = 0;
        plays.forEach((play) => {
            play.misc.forEach(({ fieldId, playerId, data }) => {
                if (fieldId === dimension.id && data === value) {
                    // Was used in the play
                    count += 1;
                    if (playerId != null) {
                        // Check if used by a winner
                        const playerRanking = play.getRanking(playerId);
                        if (playerRanking) {
                            if (playerRanking.position === 1) {
                                winCount += 1;
                            }
                            // Average normalized position
                            if (playerRanking.normalizedPosition != null) {
                                normalizedPositionSum += playerRanking.normalizedPosition;
                                normalizedPositionCount += 1;
                            }
                        } else {
                            console.warn(`Play ${play.id} probably corrupt: player with ID ${playerId} was not in this play`);
                        }
                    }
                }
            });
        });
        const averageNormalizedPosition = normalizedPositionCount > 0
            ? normalizedPositionSum / normalizedPositionCount : null;
        return { dimension, option, count, winCount, averageNormalizedPosition };
    });
}
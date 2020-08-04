import React from 'react';
import { Game, GameFieldDefinition } from "./domain/game";
import { Play } from "./domain/play";
import ReportTable from './ReportTable';

interface ScoreFieldStatistics {
  field: GameFieldDefinition<number>;
  game: Game;
  winnerAverageScore: number | null;
  winnerScoreSum: number;
  winnerScoreCount: number;
}

function getScoreFieldStatistics(game: Game, plays: Play[]): Record<string, ScoreFieldStatistics> {
  const results: Record<string, ScoreFieldStatistics> = {};
  plays.forEach((play) => {
    // Get the fields enabled for this specific play
    const fields = game.getScoreFields(play.expansions);
    fields.forEach(({ field }) => {
      const fieldStats: ScoreFieldStatistics = results[field.id] || {
        game,
        field,
        winnerAverageScore: null,
        winnerScoreCount: 0,
        winnerScoreSum: 0,
      };
      results[field.id] = fieldStats;
      // Iterate each ranking in this play
      play.rankings.forEach(({ player, position }) => {
        const score = play.getScoreFieldValue(player.id, field.id);
        if (position === 1) {
          fieldStats.winnerScoreCount += 1;
          fieldStats.winnerScoreSum += score;
          fieldStats.winnerAverageScore = fieldStats.winnerScoreSum / fieldStats.winnerScoreCount;
        }
      });
    });
  });
  return results;
}

function GameScoreCategoryReport(props: { game: Game, plays: Play[] }) {
  const { game, plays } = props;
  const scoreFieldStatsById = getScoreFieldStatistics(game, plays);
  const scoreFieldStats = Object.values(scoreFieldStatsById);
  if (!scoreFieldStats.length) {
    return null;
  }
  const columns = [{
    name: 'Score category',
  }, {
    name: 'Average score of winners',
  }];
  const rows = scoreFieldStats.map(({ field, winnerAverageScore }) => [{
    value: field.name,
  }, {
    value: winnerAverageScore == null ? '–' : winnerAverageScore.toFixed(1),
  }]);
  return (
    <>
      <h4>Score categories</h4>
      <p>Based on {plays.length} plays.</p>
      <ReportTable columns={columns} rows={rows} />
    </>
  );
}

export default GameScoreCategoryReport;

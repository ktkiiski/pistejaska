import React from 'react';
import { Game, GameFieldDefinition } from "./domain/game";
import { Play } from "./domain/play";
import ReportTable from './ReportTable';
import { calculatePearsonCorrelation } from './common/correlation';
import orderBy from 'lodash/orderBy';

interface ScoreFieldStatistics {
  field: GameFieldDefinition<number>;
  game: Game;
  winnerAverageScore: number | null;
  winnerScoreSum: number;
  winnerScoreCount: number;
  rankingCorrelation: number | null;
  scorePositions: number[];
  rankingPositions: number[];
}

function getScoreFieldStatistics(game: Game, plays: Play[]): Record<string, ScoreFieldStatistics> {
  const results: Record<string, ScoreFieldStatistics> = {};
  plays.forEach((play) => {
    // Get the fields enabled for this specific play
    const fields = game.getScoreFields(play.expansions)
      .filter(({ field }) => field.id !== 'tie-breaker' && field.id !== 'misc');
    fields.forEach(({ field }) => {
      const fieldStats: ScoreFieldStatistics = results[field.id] || {
        game,
        field,
        winnerAverageScore: null,
        winnerScoreCount: 0,
        winnerScoreSum: 0,
        rankingCorrelation: null,
        rankingPositions: [],
        scorePositions: [],
      };
      results[field.id] = fieldStats;
      // Iterate each ranking in this play
      const scoreRankings = play.rankings.map(({ player, position }) => ({
        rankingPosition: position,
        score: play.getScoreFieldValue(player.id, field.id),
      }));
      let scorePosition = 1;
      let previousScore: number | null = null;
      orderBy(scoreRankings, 'score', 'desc').forEach(({ rankingPosition, score }, index) => {
        if (previousScore == null || score < previousScore) {
          scorePosition = index + 1;
          previousScore = score;
        }
        fieldStats.scorePositions.push(scorePosition);
        fieldStats.rankingPositions.push(rankingPosition);
        if (rankingPosition === 1) {
          fieldStats.winnerScoreCount += 1;
          fieldStats.winnerScoreSum += score;
          fieldStats.winnerAverageScore = fieldStats.winnerScoreSum / fieldStats.winnerScoreCount;
        }
      });
    });
  });
  // Finally calculate correlation coefficients for the rankings
  Object.values(results).forEach((stats) => {
    const coefficient = calculatePearsonCorrelation(stats.rankingPositions, stats.scorePositions);
    if (!Number.isNaN(coefficient)) {
      stats.rankingCorrelation = coefficient;
    }
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
  }, {
    name: 'Correlation with ranking',
  }];
  const rows = scoreFieldStats.map(({ field, winnerAverageScore, rankingCorrelation }) => [{
    value: field.name,
  }, {
    value: winnerAverageScore == null ? '–' : winnerAverageScore.toFixed(1),
  }, {
    value: rankingCorrelation == null ? '–' : rankingCorrelation.toFixed(2),
  }]);
  return <ReportTable columns={columns} rows={rows} />;
}

export default GameScoreCategoryReport;

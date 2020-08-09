import React from 'react';
import { Game, GameFieldDefinition } from "./domain/game";
import { Play } from "./domain/play";
import ReportTable from './ReportTable';
import { calculatePearsonCorrelation, renderCorrelation } from './common/correlation';
import { rankScores } from './common/rankings';

interface ScoreFieldStatistics {
  field: GameFieldDefinition<number>;
  game: Game;
  winnerAverageScore: number | null;
  winnerScoreSum: number;
  winnerScoreCount: number;
  rankingCorrelation: number | null;
  normalizedScorePositions: number[];
  normalizedRankingPositions: number[];
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
        normalizedRankingPositions: [],
        normalizedScorePositions: [],
      };
      results[field.id] = fieldStats;
      // Iterate each ranking in this play
      const scoreRankings = rankScores(play.rankings.map((ranking) => ({
        ranking,
        score: play.getScoreFieldValue(ranking.player.id, field.id),
      })));
      scoreRankings.forEach((scoreRanking) => {
        const { score, normalizedPosition, ranking } = scoreRanking;
        if (normalizedPosition != null && ranking.normalizedPosition != null) {
          fieldStats.normalizedScorePositions.push(normalizedPosition);
          fieldStats.normalizedRankingPositions.push(ranking.normalizedPosition);
        }
        if (ranking.position === 1) {
          fieldStats.winnerScoreCount += 1;
          fieldStats.winnerScoreSum += score;
          fieldStats.winnerAverageScore = fieldStats.winnerScoreSum / fieldStats.winnerScoreCount;
        }
      });
    });
  });
  // Finally calculate correlation coefficients for the rankings
  Object.values(results).forEach((stats) => {
    const coefficient = calculatePearsonCorrelation(stats.normalizedRankingPositions, stats.normalizedScorePositions);
    if (!Number.isNaN(coefficient)) {
      stats.rankingCorrelation = coefficient;
    }
  });
  return results;
}

function GameScoreFieldReport(props: { game: Game, plays: Play[] }) {
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
    value: winnerAverageScore == null ? '–' : winnerAverageScore.toFixed(0),
  }, {
    value: renderCorrelation(rankingCorrelation),
  }]);
  return <ReportTable columns={columns} rows={rows} />;
}

export default GameScoreFieldReport;

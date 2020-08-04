import React from 'react';
import { Play } from "./domain/play";
import ReportTable from './ReportTable';
import { calculatePearsonCorrelation } from './common/correlation';
import { Game } from './domain/game';

const columns = [{
  name: 'Factor',
}, {
  name: 'Correlation with ranking',
}];

function GameCorrelationReport(props: { game: Game, plays: Play[] }) {
  const { game, plays } = props;
  if (game.simultaneousTurns) {
    return null;
  }
  const normalizedPositions: number[] = [];
  const normalizedIndexes: number[] = [];
  plays.forEach((play) => {
    play.rankings.forEach(({ normalizedIndex, normalizedPosition }) => {
      if (normalizedIndex != null && normalizedPosition != null) {
        normalizedPositions.push(normalizedPosition);
        normalizedIndexes.push(normalizedIndex);
      }
    });
  });
  const correlation = calculatePearsonCorrelation(normalizedPositions, normalizedIndexes);
  const rows = [[{
    value: 'Starting order',
  }, {
    value: Number.isNaN(correlation) ? '–' : correlation.toFixed(2),
  }]];
  return <ReportTable columns={columns} rows={rows} />;
}

export default GameCorrelationReport;

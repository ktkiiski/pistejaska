import React from 'react';
import {
  LineChart, Line, XAxis, YAxis,
} from 'recharts';
import { Play } from './domain/play';
import sortBy from 'lodash/sortBy';
import { makeStyles } from '@material-ui/core';

interface DataPoint {
  count: number;
  plays: Play[];
  normalizedIndex: number;
  normalizedPositionSum: number;
  averageRanking: number;
}

const useStyles = makeStyles((theme) => ({
  chart: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tooltip: {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 4,
    fontSize: 11,
    color: '#555',
  },
}));

function WinOrderCorrelationChart({ plays }: { plays: Play[] }) {
  const styles = useStyles();
  const dataPointsByKey: {[key: string]: DataPoint} = {};
  plays.forEach((play) => {
    play.rankings.forEach(({ normalizedIndex, normalizedPosition }) => {
      if (normalizedIndex != null && normalizedPosition != null) {
        const key = normalizedIndex.toFixed(4);
        let dataPoint = dataPointsByKey[key];
        if (dataPoint) {
          dataPoint.count += 1;
          dataPoint.plays.push(play);
          dataPoint.normalizedPositionSum += normalizedPosition;
          dataPoint.averageRanking = 1 - dataPoint.normalizedPositionSum / dataPoint.count;
        } else {
          dataPoint = {
            count: 1,
            plays: [play],
            normalizedIndex,
            normalizedPositionSum: normalizedPosition,
            averageRanking: 1 - normalizedPosition,
          };
          dataPointsByKey[key] = dataPoint;
        }
      }
    });
  });
  const dataPoints = sortBy(Object.values(dataPointsByKey), 'normalizedIndex');
  return (
    <LineChart
      width={400}
      height={300}
      className={styles.chart}
    >
      <XAxis
        type="number"
        name="Starting order"
        label="Starting order"
        dataKey="normalizedIndex"
        tickSize={4}
        domain={[0, 1]}
        ticks={[0, 1]}
        tickFormatter={(index) => index === 0 ? 'first' : 'last'}
      />
      <YAxis
        type="number"
        name="Ranking"
        label="Ranking"
        tickSize={4}
        domain={[0, 1]}
        ticks={[0, 1]}
        tickFormatter={(position) => position === 0 ? 'loser' : 'winner'}
      />
      <Line
        type="basis"
        connectNulls
        dataKey="averageRanking"
        data={dataPoints}
        fill="#8884d8"
      />
    </LineChart>
  )
}

export default React.memo(WinOrderCorrelationChart);

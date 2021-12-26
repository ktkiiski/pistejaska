import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useGames } from "./common/hooks/useGames";
import { Play } from "./domain/play";
import { countBy, groupBy, minBy, orderBy } from "lodash";
import { makeStyles } from "@material-ui/core";

interface GamePopularityChartProps {
  plays: Play[];
}

function getSlot(year: number, month: number) {
  return `${month + 1}/${year}`;
}

function useGamePopularityTimeData(plays: Play[]) {
  const [allGames] = useGames();
  if (!allGames) {
    return [null, []] as const;
  }
  const dates = plays
    .map((play) => play.getDate())
    .filter((date) => date.getTime() > 0);
  const playsBySlot = groupBy(plays, (play) => {
    const date = play.getDate();
    return getSlot(date.getFullYear(), date.getMonth());
  });
  const now = new Date();
  const maxDate = now; // maxBy(dates) || now;
  const minDate = minBy(dates) || maxDate;
  const startYear = minDate.getFullYear();
  const startMonth = minDate.getMonth();
  const endYear = maxDate.getFullYear();
  const endMonth = maxDate.getMonth();
  const data = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    const slot = getSlot(year, month);
    const slotPlays = playsBySlot[slot];
    const gameCounts = allGames.reduce((countByGameId, game) => {
      const playCount =
        slotPlays?.filter((play) => play.gameId === game.id).length ?? 0;
      if (!playCount) {
        return countByGameId;
      }
      return {
        ...countByGameId,
        [game.id]: playCount,
      };
    }, {});
    data.push({
      name: slot,
      counts: gameCounts,
    });
    month += 1;
    if (month >= 12) {
      year += 1;
      month = 0;
    }
  }
  const countsByGame = countBy(plays, (play) => play.gameId);
  const games = orderBy(
    allGames.filter((game) => countsByGame[game.id] != null),
    (game) => countsByGame[game.id],
    "desc"
  );
  return [games, data] as const;
}

const colors = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabed4",
  "#469990",
  "#dcbeff",
  "#9a6324",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#a9a9a9",
  "#0000ff",
  "#a52a2a",
  "#00008b",
  "#008b8b",
  "#006400",
  "#bdb76b",
  "#8b008b",
  "#556b2f",
  "#ff8c00",
  "#9932cc",
  "#8b0000",
  "#e9967a",
  "#9400d3",
  "#ff00ff",
  "#ffd700",
  "#008000",
  "#4b0082",
  "#f0e68c",
  "#add8e6",
  "#90ee90",
  "#ffb6c1",
  "#000080",
  "#ffa500",
  "#ffc0cb",
  "#800080",
  "#ff0000",
  "#ffff00",
  "#d3d3d3",
  "#c0c0c0",
  "#ffffff",
  "#e0ffff",
  "#00ffff",
  "#00ff00",
  "#ffffe0",
  "#f5f5dc",
  "#f0ffff",
  "#fffac8",
];

const useStyles = makeStyles({
  chart: {
    width: "100%",
    height: "60vw",
    position: "relative",
    fontSize: 10,
  },
});

function GameTrendChart({ plays }: GamePopularityChartProps) {
  const styles = useStyles();
  const [games, data] = useGamePopularityTimeData(plays);
  if (!games) {
    return null;
  }
  return (
    <div className={styles.chart}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          barCategoryGap={0}
          margin={{
            top: 5,
            bottom: 5,
            right: 10,
            left: 10,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis width={15} domain={[0, "dataMax"]} tickSize={3} />
          <Tooltip />
          <Legend iconType="square" align="center" iconSize={10} />
          {games.map((game, index) => (
            <Bar
              key={game.id}
              name={game.name}
              dataKey={`counts.${game.id}`}
              stackId="a"
              fill={colors[index % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GameTrendChart;

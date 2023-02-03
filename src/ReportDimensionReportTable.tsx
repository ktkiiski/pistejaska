import { sortBy } from "lodash";
import { GameMiscFieldDefinition } from "./domain/game";
import { Play } from "./domain/play";
import { getDimensionStatistics } from "./domain/statistics";
import ReportTable from "./ReportTable";
import { renderPercentage } from "./common/stringUtils";

const ReportDimensionReportTable = (props: {
  plays: Play[];
  dimension: GameMiscFieldDefinition<string>;
  playerId?: string;
}) => {
  const { plays, dimension, playerId } = props;

  const columns = [
    { name: dimension.name },
    {
      name: "Wins",
      tooltip: "Percentage of wins (or tied wins) of all the times used.",
    },
    {
      name: "Usage",
      tooltip:
        "Percentage and the number of all plays where this has been used.",
    },
    {
      name: "Normalized rank",
      tooltip:
        'Average normalized rank in all of times this was used. 100% = only wins, 0% = only losses, 50% =  "middle" position (e.g. 2nd in 3-player play)',
    },
  ];

  const stats = Array.from(
    getDimensionStatistics(plays, dimension, playerId).values()
  );
  const rows = sortBy(
    stats,
    (stat) => stat.averageNormalizedPosition ?? Number.POSITIVE_INFINITY,
    (stat) => -stat.useCount
  );
  const playCount = plays.length;

  const reportRows = rows.map((row) => {
    return [
      { value: row.option.label },
      { value: renderPercentage(row.winCount, row.useCount) },
      { value: renderPercentage(row.playCount, playCount) },
      {
        value:
          row.averageNormalizedPosition == null
            ? null
            : Math.round(100 - row.averageNormalizedPosition * 100),
      },
    ];
  });

  const beautifiedReportRows = reportRows.map((x) =>
    x.map((y) => {
      if (typeof y.value === "string") {
        return { value: y.value };
      }
      if (y.value == null || Number.isNaN(y.value)) {
        return { value: "—" };
      }
      return { value: `${y.value} %` };
    })
  );

  return (
    <ReportTable rows={beautifiedReportRows} columns={columns}></ReportTable>
  );
};

export default ReportDimensionReportTable;

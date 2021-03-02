import React from "react";
import { sortBy } from "lodash";
import { GameMiscFieldDefinition } from "./domain/game";
import { Play } from "./domain/play";
import { getDimensionStatistics } from "./domain/statistics";
import ReportTable from "./ReportTable";

function renderPercentage(count: number, max: number) {
  const percentage = Math.round((count / max) * 100);
  if (Number.isNaN(percentage) || !Number.isFinite(percentage)) {
    return "–";
  }
  return `${percentage}% (${count})`;
}

const ReportDimensionReportTable = (props: {
  plays: Play[];
  dimension: GameMiscFieldDefinition<string>;
}) => {
  const { plays, dimension } = props;

  const columns = [
    { name: dimension.name },
    { name: "Win percentage" },
    { name: "Use percentage" },
    {
      name: "Average normalized rank",
      tooltip:
        '100% = only wins, 0% = only losses, 50% =  "middle" position (e.g. 2nd in 3-player play)',
    },
  ];

  const stats = Array.from(getDimensionStatistics(plays, dimension).values());
  const rows = sortBy(
    stats,
    (stat) => stat.averageNormalizedPosition ?? Number.POSITIVE_INFINITY,
    (stat) => -stat.count
  );
  const playCount = plays.length;

  const reportRows = rows.map((row) => {
    return [
      { value: row.option.label },
      { value: renderPercentage(row.winCount, row.count) },
      { value: renderPercentage(row.count, playCount) },
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

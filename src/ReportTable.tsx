import React from 'react';
import ReactTooltip from "react-tooltip";
import {
  makeStyles,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

const useReportTableStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    paddingLeft: "4px",
  },
  table: {
    maxWidth: "100%",
  },
  "@global": {
    ".MuiTableCell-root": {
      padding: "0",
      fontSize: "0.8em",
    },
  },
}));

type ReportTableProps = {
  rows: ReportTableRow[][];
  columns: { name: string; tooltip?: string }[];
};
type ReportTableRow = {
  value: string;
  link?: string;
};
const ReportTable = ({ rows, columns }: ReportTableProps) => {
  const classes = useReportTableStyles();

  if (rows.length === 0) {
    return <>No plays</>;
  }

  return (
    <div className={classes.root}>
      <ReactTooltip />
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.name}>
                  {c.name}
                  {c.tooltip ? (
                    <span
                      style={{
                        borderRadius: "10px",
                        padding: "0 5px",
                        backgroundColor: "#ccc",
                        color: "#fff",
                        marginLeft: "5px",
                      }}
                      data-tip={c.tooltip}
                    >
                      ?
                    </span>
                  ) : (
                    <></>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row[0].value}>
                {columns.map((column, columnIdx) => (
                  <TableCell scope="row" key={`${row[0].value}:${column.name}`}>
                    <a href={row[columnIdx]?.link}>{row[columnIdx]?.value}</a>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default ReportTable;

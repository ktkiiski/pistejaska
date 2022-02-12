import React from "react";
import ReactTooltip from "react-tooltip";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import Table from "./common/components/tables/Table";
import TableHead from "./common/components/tables/TableHead";
import TableRow from "./common/components/tables/TableRow";
import TableHeadCell from "./common/components/tables/TableHeadCell";
import TableBody from "./common/components/tables/TableBody";
import TableCell from "./common/components/tables/TableCell";

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
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableHeadCell key={c.name}>
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
              </TableHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[0].value}>
              {columns.map((column, columnIdx) => (
                <TableCell scope="row" key={`${row[0].value}:${column.name}`}>
                  {row[columnIdx]?.link !== undefined ? (
                    <Link to={row[columnIdx]?.link ?? ""}>
                      {row[columnIdx]?.value}
                    </Link>
                  ) : (
                    <>{row[columnIdx]?.value}</>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportTable;

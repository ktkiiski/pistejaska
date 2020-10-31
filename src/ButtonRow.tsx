import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(2),
    },
  },
}));

function ButtonRow({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  return <div className={styles.buttonRow}>{children}</div>;
}

export default ButtonRow;

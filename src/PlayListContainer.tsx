import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { Tabs, Tab, makeStyles } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { PlayList } from "./PlayList";
import { GameReportList } from "./GameReportList";

export const PlayListContainer = (props: RouteComponentProps<{}>) => {
  // eslint-disable-next-line
  const [value, loading, error] = useCollection(
    firebase.firestore().collection("plays-v1")
  );

  const [selectedTab, setSelectedTab] = React.useState(0);

  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1
      // backgroundColor: theme.palette.background.default
    }
  }));

  const classes = useStyles();

  if (error) {
    return (
      <div>
        Permission denied. Ask permissions from panu.vuorinen@gmail.com.
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {/* <AppBar position="static"> */}
      <Tabs
        value={selectedTab}
        onChange={(event, newValue) => setSelectedTab(newValue)}
        aria-label="simple tabs example"
      >
        <Tab label="Plays" onClick={() => setSelectedTab(0)} />
        <Tab label="Reports" onClick={() => setSelectedTab(1)} />
      </Tabs>
      {/* </AppBar> */}

      <div hidden={selectedTab !== 0}>
        <PlayList {...props} />
      </div>
      <div hidden={selectedTab !== 1}>
        <GameReportList {...props} />
      </div>
    </div>
  );
};

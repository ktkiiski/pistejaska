import React from "react";
import { Tabs, Tab, makeStyles } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { PlayList } from "./PlayList";
import { GameReportList } from "./GameReportList";
import { usePlays } from "./common/hooks/usePlays";

export const PlayListContainer = (props: RouteComponentProps<{}>) => {
  // eslint-disable-next-line
  const [plays, loading, error] = usePlays();

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

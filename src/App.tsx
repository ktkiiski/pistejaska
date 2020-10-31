import React from "react";
import "./App.css";
import { Login } from "./Login";
import * as firebase from "firebase/app";
import "firebase/auth";
import { NavBar } from "./NavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Admin } from "./Admin";
import { SelectGame } from "./SelectGame";
import { PlayEdit } from "./PlayEdit";
import { PlayView } from "./PlayView";
import { CircularProgress } from "@material-ui/core";
import { MarkdownViewer } from "./MarkdownViewer";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ReportGameView } from "./ReportGameView";
import { PlayList } from "./PlayList";
import { ReportGameList } from "./ReportGameList";
import SelectPlayers from "./SelectPlayers";
import SelectPlayersFromPlay from "./SelectPlayersFromPlay";
import { ReportPlayerView } from "./ReportPlayerView";
import { ReportPlayerList } from "./ReportPlayerList";

var config = {
  apiKey: "AIzaSyDI_XDKW2vVftx7oUy1a_QTR5BE8j6S-Ds",
  authDomain: "pistejaska-dev.firebaseapp.com",
  databaseURL: "https://pistejaska-dev.firebaseio.com",
  projectId: "pistejaska-dev",
  storageBucket: "pistejaska-dev.appspot.com",
  messagingSenderId: "597805798706",
};
firebase.initializeApp(config);

const center = {
  position: "absolute" as any,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};
const App = () => {
  const [user, loading] = useAuthState(firebase.auth());
  if (loading) {
    return (
      <div style={center}>
        <CircularProgress />
      </div>
    );
  }
  const app = !user ? (
    <Login />
  ) : (
    <>
      <Route path="/" component={NavBar} />
      <Route path="/" exact component={PlayList} />
      <Route path="/view/:playId" component={PlayView} />
      <Route path="/players" exact component={ReportPlayerList} />
      <Route path="/reports" exact component={ReportGameList} />
      <Route path="/reports/player/:playerId" component={ReportPlayerView} />
      <Route path="/reports/game/:gameId" component={ReportGameView} />
      <Route path="/edit/:playId" component={PlayEdit} />
      <Route
        path="/new/:gameId"
        exact
        render={({
          match: {
            params: { gameId },
          },
        }) => <SelectPlayers gameId={gameId} />}
      />
      <Route
        path="/replay/:playId"
        exact
        render={({
          match: {
            params: { gameId, playId },
          },
        }) => <SelectPlayersFromPlay playId={playId} />}
      />
      <Route path="/new/" exact component={SelectGame} />
      <Route path="/admin/" component={Admin} />
      <Route
        path="/whatsnew/"
        render={(props) => <MarkdownViewer {...props} fileName="CHANGELOG" />}
      />
    </>
  );

  const theme = createMuiTheme({
    spacing: 2,
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>{app}</Router>
      </div>
    </ThemeProvider>
  );
};

export default App;

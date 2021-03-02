import React from "react";
import "./App.css";
import { Login } from "./Login";
import { NavBar } from "./NavBar";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
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
import Admin from "./Admin";
import firebase from './common/firebase';

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
      <Route path="/games" exact component={ReportGameList} />
      <Route path="/games/:gameId" component={ReportGameView} />
      <Route path="/players" exact component={ReportPlayerList} />
      <Route path="/players/:playerId" component={ReportPlayerView} />
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
      <Route path="/reports">
        <Redirect to="/games" />
      </Route>
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

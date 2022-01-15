import React from "react";
import "./App.css";
import { Login } from "./Login";
import { NavBar } from "./common/components/NavBar";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { SelectGame } from "./SelectGame";
import { PlayEdit } from "./PlayEdit";
import { PlayView } from "./PlayView";
import { CircularProgress } from "@material-ui/core";
import { MarkdownViewer } from "./MarkdownViewer";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { ReportGameView } from "./ReportGameView";
import { PlayListView } from "./PlayListView";
import { ReportGameList } from "./ReportGameList";
import SelectPlayers from "./SelectPlayers";
import SelectPlayersFromPlay from "./SelectPlayersFromPlay";
import { ReportPlayerView } from "./ReportPlayerView";
import { ReportPlayerList } from "./ReportPlayerList";
import Admin from "./Admin";
import { getAuth } from "firebase/auth";

const center = {
  position: "absolute" as any,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};
const App = () => {
  const [user, loading] = useAuthState(getAuth());
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
      <Route path="/" exact component={PlayListView} />
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

  const theme = createTheme({
    spacing: 2,
  });
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 min-h-screen">
        <Router>{app}</Router>
      </div>
    </ThemeProvider>
  );
};

export default App;

import React from "react";
import "./App.css";
import { Login } from "./Login";
import { NavBar } from "./common/components/NavBar";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { SelectGame } from "./SelectGame";
import { PlayEdit } from "./PlayEdit";
import { PlayView } from "./PlayView";
import { MarkdownViewer } from "./MarkdownViewer";
import { ReportGameView } from "./ReportGameView";
import { PlayListView } from "./PlayListView";
import { ReportGameList } from "./ReportGameList";
import SelectPlayers from "./SelectPlayers";
import SelectPlayersFromPlay from "./SelectPlayersFromPlay";
import { ReportPlayerView } from "./ReportPlayerView";
import { ReportPlayerList } from "./ReportPlayerList";
import Admin from "./Admin";
import { getAuth } from "firebase/auth";
import { LoadingSpinner } from "./common/components/LoadingSpinner";

const App = () => {
  const [user, loading] = useAuthState(getAuth());
  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
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

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 min-h-screen">
      <Router>{app}</Router>
    </div>
  );
};

export default App;

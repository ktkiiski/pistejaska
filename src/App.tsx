import { Login } from "./Login";
import { NavBar } from "./common/components/NavBar";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { SelectGame } from "./SelectGame";
import { PlayEdit } from "./PlayEdit";
import { PlayView } from "./PlayView";
import WhatsNewView from "./WhatsNewView";
import { ReportGameView } from "./ReportGameView";
import { PlayListView } from "./PlayListView";
import { ReportGameList } from "./ReportGameList";
import ReplayView from "./SelectPlayersFromPlay";
import { ReportPlayerView } from "./ReportPlayerView";
import { ReportPlayerList } from "./ReportPlayerList";
import Admin from "./Admin";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import NewPlayView from "./NewPlayView";
import useCurrentUser from "./common/hooks/useCurrentUser";

const App = () => {
  const [user, loading] = useCurrentUser();
  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  const app = (
    <Routes>
      <Route path="/" element={<PlayListView />} />
      <Route path="/view/:playId" element={<PlayView />} />
      <Route path="/games" element={<ReportGameList />} />
      <Route path="/games/:gameId" element={<ReportGameView />} />
      <Route path="/players" element={<ReportPlayerList />} />
      <Route path="/players/:playerId" element={<ReportPlayerView />} />
      <Route path="/edit/:playId" element={<PlayEdit />} />
      <Route path="/new/:gameId" element={<NewPlayView />} />
      <Route path="/replay/:playId" element={<ReplayView />} />
      <Route path="/new" element={<SelectGame />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/whatsnew" element={<WhatsNewView />} />
      <Route path="/reports" element={<Navigate to="/games" />} />
    </Routes>
  );

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 min-h-screen">
      <Router>
        {user ? (
          <>
            <NavBar />
            {app}
          </>
        ) : (
          <Login />
        )}
      </Router>
    </div>
  );
};

export default App;

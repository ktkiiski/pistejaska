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
import AdminGameEditView from "./AdminGameEditView";
import AdminGameJsonEditorView from "./AdminGameJsonEditorView";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import NewPlayView from "./NewPlayView";
import useCurrentUser from "./common/hooks/useCurrentUser";
import { useEffect } from "react";
import addOrUpdateUser from "./actions/addOrUpdateUser";
import ReportPlayerGameView from "./ReportPlayerGameView";

const App = () => {
  const [user, loading] = useCurrentUser();

  useEffect(() => {
    // always add new users to DB (required for notifications)
    if (user) {
      const updateUser = async () => {
        await addOrUpdateUser(user);
      };
      updateUser().catch(() => {
        /* Hopefully we don't end up here */
      });
    }
  }, [user]);

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
      <Route
        path="/players/:playerId/games/:gameId"
        element={<ReportPlayerGameView />}
      />
      <Route path="/edit/:playId" element={<PlayEdit />} />
      <Route path="/new/:gameId" element={<NewPlayView />} />
      <Route path="/replay/:playId" element={<ReplayView />} />
      <Route path="/new" element={<SelectGame />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/edit-game" element={<AdminGameEditView />} />
      <Route path="/admin/edit-game-json" element={<AdminGameJsonEditorView />} />
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

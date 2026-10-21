import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewsFeed from "./pages/NewsFeed";
import useAPI from "./store/useAPI";
import UnauthorizedAccess from "./errors/UnauthorizedAccess";
import NotFoundError from "./errors/NotFoundError";
import InternalServerError from "./errors/InternalServerError";
import MainApp from "./layouts/MainApp";

const App = () => {
  const { user } = useAPI();

  return (
    <Router>
      <Routes>
        {/* Fixed: Removed conflicting 'index' prop */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/news-feed"
          element={user ? <MainApp /> : <Navigate to="/" replace />}
        >
          <Route index element={<NewsFeed />} />
        </Route>

        <Route path="/unauthorized-access" element={<UnauthorizedAccess />} />
        <Route
          path="/internal-server-error"
          element={<InternalServerError />}
        />
        <Route path="*" element={<NotFoundError />} />
      </Routes>
    </Router>
  );
};

export default App;

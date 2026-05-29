{/* importing from react-route dom  */}
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
{/* importing from Home.jsx and Dashboard.jsx */}
import Home from '../pages/Home';

import Dashboard from '../pages/Dashboard';

import UploadsPage from "../pages/UploadsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/uploads"
          element={<UploadsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
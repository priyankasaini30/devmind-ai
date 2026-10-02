import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CodeReview from "./pages/CodeReview";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Interview from "./pages/Interview";
import Notes from "./pages/Notes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/review"
            element={
              <PrivateRoute>
                <CodeReview />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute>
                <Interview />
              </PrivateRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <Notes />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
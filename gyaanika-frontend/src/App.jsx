import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Gateway from "./pages/Gateway";
import SearchFilters from "./components/SearchFilters";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* HOME / STUDENT PORTAL */}
          <Route path="/" element={<SearchFilters />} />
          <Route path="/portal" element={<Navigate to="/" replace />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

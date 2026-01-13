import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Home from "../pages/Home";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ProjectsPage from "../features/projects/pages/ProjectsPage";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME (always public) */}
      <Route path="/" element={<Home />} />

      {/* PUBLIC (only when logged out) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* PROTECTED (only when logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* future protected routes */}
        <Route path="/projects" element={<ProjectsPage />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

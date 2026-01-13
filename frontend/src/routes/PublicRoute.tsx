import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../features/auth/auth.api";

export default function PublicRoute() {
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
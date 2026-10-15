
import { Navigate, useLocation } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const location = useLocation();

  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return (
      <Navigate
        to="/admin/login"
        state={{
          from: location.pathname,
          message: "Please sign in to access the admin portal.",
        }}
        replace
      />
    );
  }

  return children;
}

export default AdminProtectedRoute;

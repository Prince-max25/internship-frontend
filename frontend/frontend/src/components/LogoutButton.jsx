
import { useNavigate } from "react-router-dom";

function LogoutButton({ className = "admin-logout" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    // Clear temporary session data
    sessionStorage.clear();

    // Go to landing page
    navigate("/", { replace: true });

    // Replace the current browser history entry
    window.history.replaceState(
      null,
      "",
      "/"
    );
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
    >
      <span>↪</span>
      Logout
    </button>
  );
}

export default LogoutButton;

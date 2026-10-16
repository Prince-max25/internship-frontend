
import { useNavigate } from "react-router-dom";

function AdminLogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove admin authentication
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    // Replace the current history entry
    navigate("/admin/login", {
      replace: true,
      state: {
        message: "You have been logged out successfully.",
      },
    });
  };

  return (
    <button
      type="button"
      className="admin-logout"
      onClick={handleLogout}
    >
      <span>↪</span>
      Logout
    </button>
  );
}

export default AdminLogoutButton;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Departments from "./pages/Departments";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Apply from "./pages/Apply";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplicants from "./pages/AdminApplicants";
import AdminApplicantProfile from "./pages/AdminApplicantProfile";
import AdminDepartments from "./pages/AdminDepartments";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings";
import AdminReports from "./pages/AdminReports";
import ApplicationStatus from "./pages/ApplicationStatus";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import "./DarkMode.css";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
function App() {
  useEffect(() => {
  const savedDarkMode =
    localStorage.getItem("dark_mode") === "true";

  if (savedDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}, []);
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route
          path="/departments"
          element={<Departments />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
        path="/apply"
        element={
          <ProtectedRoute>
            <Apply />
          </ProtectedRoute>
        }
      />

       <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      ```jsx
<Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
  path="/admin/dashboard"
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/applicants"
  element={
    <AdminProtectedRoute>
      <AdminApplicants />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/applicants/:id"
  element={
    <AdminProtectedRoute>
      <AdminApplicantProfile />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/departments"
  element={
    <AdminProtectedRoute>
      <AdminDepartments />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/notifications"
  element={
    <AdminProtectedRoute>
      <AdminNotifications />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/settings"
  element={
    <AdminProtectedRoute>
      <AdminSettings />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <AdminProtectedRoute>
      <AdminReports />
    </AdminProtectedRoute>
  }
/>


    <Route
    path="/application-status"
    element={
      <ProtectedRoute>
        <ApplicationStatus />
      </ProtectedRoute>
    }
  />

   <Route
    path="/notifications"
    element={
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    }
  />

    <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

    <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
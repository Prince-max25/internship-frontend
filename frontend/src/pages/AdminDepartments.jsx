import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDepartments.css";

const API_URL = "http://localhost:5000";

function AdminDepartments() {
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingDepartment, setEditingDepartment] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // LOAD DEPARTMENTS
  // =========================================

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/departments`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load departments."
        );
      }

      setDepartments(data);

    } catch (error) {
      console.error(
        "Department loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load departments."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // =========================================
  // OPEN ADD MODAL
  // =========================================

  const openAddModal = () => {
    setEditingDepartment(null);

    setForm({
      name: "",
      description: "",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // =========================================
  // OPEN EDIT MODAL
  // =========================================

  const openEditModal = (department) => {
    setEditingDepartment(department);

    setForm({
      name: department.name,
      description: department.description || "",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // =========================================
  // CLOSE MODAL
  // =========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);

    setForm({
      name: "",
      description: "",
    });
  };

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // SAVE DEPARTMENT
  // =========================================

  const saveDepartment = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError(
        "Please enter a department name."
      );
      return;
    }

    try {
      const isEditing =
        Boolean(editingDepartment);

      const url = isEditing
        ? `${API_URL}/api/admin/departments/${editingDepartment.id}`
        : `${API_URL}/api/admin/departments`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save department."
        );
      }

      closeModal();

      setSuccess(
        isEditing
          ? "Department updated successfully."
          : "Department created successfully."
      );

      await loadDepartments();

    } catch (error) {
      console.error(
        "Save department error:",
        error
      );

      setError(
        error.message ||
          "Unable to save department."
      );
    }
  };

  // =========================================
  // DELETE DEPARTMENT
  // =========================================

  const deleteDepartment = async (id) => {
    const department = departments.find(
      (item) => item.id === id
    );

    if (!department) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/departments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete department."
        );
      }

      setSuccess(
        "Department deleted successfully."
      );

      await loadDepartments();

    } catch (error) {
      console.error(
        "Delete department error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete department."
      );
    }
  };

  // =========================================
  // TOTAL APPLICANTS
  // =========================================

  const totalApplicants =
    departments.reduce(
      (total, department) =>
        total +
        Number(department.applicants || 0),
      0
    );

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          Internship<span>Portal</span>
          <small>ADMIN</small>
        </div>

        <nav className="admin-nav">

          <Link
            to="/admin/dashboard"
            className="admin-nav-link"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/admin/applicants"
            className="admin-nav-link"
          >
            <span>♙</span>
            Applicants
          </Link>

          <Link
            to="/admin/departments"
            className="admin-nav-link active"
          >
            <span>▤</span>
            Departments
          </Link>

          <Link
            to="/admin/reports"
            className="admin-nav-link"
          >
            <span>▥</span>
            Reports
          </Link>

          <Link
            to="/admin/notifications"
            className="admin-nav-link"
          >
            <span>♢</span>
            Notifications
          </Link>

          <Link
            to="/admin/settings"
            className="admin-nav-link"
          >
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <Link
            to="/admin/login"
            className="admin-logout"
          >
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>Departments</h1>

            <p>
              Manage internship departments and
              available opportunities.
            </p>
          </div>

          <div className="admin-header-right">

            <button className="admin-notification">
              ♢
              <span></span>
            </button>

            <div className="admin-user">

              <div className="admin-avatar">
                AD
              </div>

              <div>
                <strong>
                  Administrator
                </strong>

                <small>
                  System Admin
                </small>
              </div>

            </div>

          </div>

        </header>


        {/* MESSAGES */}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-success">
            ✓ {success}
          </div>
        )}


        {/* SUMMARY */}

        <section className="department-summary">

          <div className="department-stat">

            <span>
              Total Departments
            </span>

            <strong>
              {departments.length}
            </strong>

          </div>

          <div className="department-stat">

            <span>
              Total Applicants
            </span>

            <strong>
              {totalApplicants.toLocaleString()}
            </strong>

          </div>

        </section>


        {/* PANEL */}

        <section className="departments-panel">

          <div className="departments-panel-header">

            <div>

              <h2>
                All Departments
              </h2>

              <p>
                Create and manage departments
                available to applicants.
              </p>

            </div>

            <button
              className="add-department-btn"
              onClick={openAddModal}
            >
              + Add Department
            </button>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="no-applicants">
              Loading departments...
            </div>
          )}


          {/* DEPARTMENT LIST */}

          {!loading &&
            departments.length > 0 && (

              <div className="department-list">

                {departments.map(
                  (department) => (

                    <div
                      className="admin-department-card"
                      key={department.id}
                    >

                      <div className="department-card-top">

                        <div className="department-icon">
                          ▤
                        </div>

                        <span className="department-status active">
                          Active
                        </span>

                      </div>


                      <h3>
                        {department.name}
                      </h3>

                      <p>
                        {department.description ||
                          "No description provided."}
                      </p>


                      <div className="department-card-actions">

                        <button
                          onClick={() =>
                            openEditModal(
                              department
                            )
                          }
                        >
                          ✎ Edit
                        </button>

                        <button
                          className="delete-department"
                          onClick={() =>
                            deleteDepartment(
                              department.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}


          {/* EMPTY */}

          {!loading &&
            departments.length === 0 && (

              <div className="no-applicants">

                <h3>
                  No departments found
                </h3>

                <p>
                  Click "Add Department" to
                  create your first department.
                </p>

              </div>

            )}

        </section>

      </main>


      {/* MODAL */}

      {showModal && (

        <div
          className="department-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="department-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="department-modal-header">

              <div>

                <h2>
                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}
                </h2>

                <p>
                  {editingDepartment
                    ? "Update department information."
                    : "Create a new internship department."}
                </p>

              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form onSubmit={saveDepartment}>

              <div className="department-form-group">

                <label>
                  Department Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Marketing"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>


              <div className="department-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe this department..."
                  value={form.description}
                  onChange={handleChange}
                />

              </div>


              <div className="department-modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                >
                  {editingDepartment
                    ? "Save Changes"
                    : "Create Department"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDepartments;
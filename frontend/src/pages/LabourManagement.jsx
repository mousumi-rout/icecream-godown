import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function LabourManagement({ user, handleCreateLabour }) {
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingLabour, setEditingLabour] = useState(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadLabours = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/users/labours`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load labour accounts.");
      }

      const data = await response.json();
      setLabours(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadLabours();
    }
  }, [user, loadLabours]);

  if (user?.role !== "ADMIN") {
    return null;
  }

  const submitLabour = async (event) => {
    await handleCreateLabour(event);
    await loadLabours();
  };

  const startEditing = (labour) => {
    setEditingLabour(labour);
    setEditName(labour.name || "");
    setEditUsername(labour.username || "");
    setEditError("");
    setEditSuccess("");
  };

  const cancelEditing = () => {
    setEditingLabour(null);
    setEditName("");
    setEditUsername("");
    setEditError("");
  };

  const saveLabour = async (event) => {
    event.preventDefault();

    if (!editName.trim() || !editUsername.trim()) {
      setEditError("Name and username are required.");
      return;
    }

    setSavingEdit(true);
    setEditError("");
    setEditSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/users/labours/${editingLabour.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName.trim(),
            username: editUsername.trim(),
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to update labour account.");
      }

      setEditSuccess("Labour account updated successfully!");
      setEditingLabour(null);
      await loadLabours();
    } catch (err) {
      setEditError(err.message || "Something went wrong.");
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteLabour = async (labour) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${labour.name} (@${labour.username})?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setEditSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/users/labours/${labour.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Unable to delete labour account.");
      }

      setEditSuccess(message || "Labour account deleted successfully.");
      await loadLabours();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  // Deactivate or reactivate a labour account
  const toggleLabourStatus = async (labour) => {
    const currentlyActive = labour.active !== false;
    const nextActive = !currentlyActive;
    const action = nextActive ? "reactivate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${labour.name} (@${labour.username})?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setEditSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/users/labours/${labour.id}/status?active=${nextActive}`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Unable to update labour status.");
      }

      setEditSuccess(message || "Labour status updated successfully.");
      await loadLabours();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const isActive = (labour) => labour.active !== false;

  return (
    <main className="labour-page">
      <header className="labour-heading">
        <span className="labour-eyebrow">INVENTORY MANAGEMENT</span>
        <h1>👷 Labour Management</h1>
        <p>Create and manage labour accounts.</p>
      </header>

      <div className="labour-layout">
        {/* Create Labour Form */}
        <section className="labour-card labour-form-card">
          <div className="labour-card-heading">
            <div className="labour-heading-icon">👤</div>
            <div>
              <h2>Create Labour Account</h2>
              <p>Add a new team member to your system.</p>
            </div>
          </div>

          <form onSubmit={submitLabour}>
            <div className="labour-form-group">
              <label htmlFor="labour-name">Labour Name</label>
              <input
                id="labour-name"
                type="text"
                className="labour-input"
                placeholder="Enter full name"
                name="name"
                required
              />
            </div>

            <div className="labour-form-group">
              <label htmlFor="labour-username">Username</label>
              <input
                id="labour-username"
                type="text"
                className="labour-input"
                placeholder="Choose a username"
                name="username"
                required
              />
            </div>

            <div className="labour-form-group">
              <label htmlFor="labour-password">Password</label>
              <input
                id="labour-password"
                type="password"
                className="labour-input"
                placeholder="Create a password"
                name="password"
                required
                minLength={6}
              />
              <small>Use at least 6 characters.</small>
            </div>

            <button type="submit" className="labour-create-button">
              <span>＋</span> Create Labour
            </button>
          </form>
        </section>

        {/* Existing Labour Accounts */}
        <section className="labour-card labour-list-card">
          <div className="labour-list-heading">
            <div>
              <h2>Existing Labour Accounts</h2>
              <p>View registered team members.</p>
            </div>

            <button
              type="button"
              className="labour-refresh-button"
              onClick={loadLabours}
              disabled={loading}
            >
              <span>↻</span> {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="labour-list-content">
            {error && (
              <div className="labour-alert labour-alert-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {editSuccess && (
              <div className="labour-alert labour-alert-success" role="status">
                ✅ {editSuccess}
              </div>
            )}

            {loading ? (
              <div className="labour-empty-state">
                <span className="labour-state-icon">⏳</span>
                <p>Loading labour accounts...</p>
              </div>
            ) : labours.length === 0 ? (
              <div className="labour-empty-state">
                <span className="labour-state-icon">👥</span>
                <h3>No labour accounts yet</h3>
                <p>Create a labour account using the form.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="labour-table-wrapper">
                  <table className="labour-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {labours.map((labour) => (
                        <tr key={labour.id ?? labour.username}>
                          <td className="labour-name-cell">
                            {labour.name || "-"}
                          </td>

                          <td>{labour.username || "-"}</td>

                          <td>
                            <span className="labour-role-badge">
                              {labour.role || "LABOUR"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                isActive(labour)
                                  ? "labour-status-active"
                                  : "labour-status-inactive"
                              }
                            >
                              {isActive(labour) ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="labour-edit-button"
                              onClick={() => startEditing(labour)}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              className="labour-delete-button"
                              onClick={() => deleteLabour(labour)}
                            >
                              🗑️ Delete
                            </button>

                            <button
                              type="button"
                              className={
                                isActive(labour)
                                  ? "labour-deactivate-button"
                                  : "labour-activate-button"
                              }
                              onClick={() => toggleLabourStatus(labour)}
                            >
                              {isActive(labour)
                                ? "🔒 Deactivate"
                                : "🔓 Reactivate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="labour-mobile-list">
                  {labours.map((labour) => (
                    <article
                      className="labour-mobile-card"
                      key={labour.id ?? labour.username}
                    >
                      <div className="labour-avatar">
                        {(labour.name || "L").charAt(0).toUpperCase()}
                      </div>

                      <div className="labour-mobile-details">
                        <h3>{labour.name || "-"}</h3>
                        <p>@{labour.username || "-"}</p>

                        <span className="labour-role-badge">
                          {labour.role || "LABOUR"}
                        </span>

                        <div className="labour-mobile-status">
                          <span
                            className={
                              isActive(labour)
                                ? "labour-status-active"
                                : "labour-status-inactive"
                            }
                          >
                            {isActive(labour) ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="labour-mobile-actions">
                          <button
                            type="button"
                            className="labour-edit-button"
                            onClick={() => startEditing(labour)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            className="labour-delete-button"
                            onClick={() => deleteLabour(labour)}
                          >
                            🗑️ Delete
                          </button>

                          <button
                            type="button"
                            className={
                              isActive(labour)
                                ? "labour-deactivate-button"
                                : "labour-activate-button"
                            }
                            onClick={() => toggleLabourStatus(labour)}
                          >
                            {isActive(labour)
                              ? "🔒 Deactivate"
                              : "🔓 Reactivate"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {!loading && labours.length > 0 && (
            <footer className="labour-card-footer">
              <span>Registered labour accounts</span>
              <strong>{labours.length}</strong>
            </footer>
          )}
        </section>
      </div>

      {/* Edit Labour Modal */}
      {editingLabour && (
        <div className="labour-modal-overlay">
          <section
            className="labour-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-labour-title"
          >
            <div className="labour-modal-heading">
              <div>
                <h2 id="edit-labour-title">✏️ Edit Labour Account</h2>
                <p>Update the labour member's details.</p>
              </div>

              <button
                type="button"
                className="labour-modal-close"
                onClick={cancelEditing}
                disabled={savingEdit}
                aria-label="Close edit form"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveLabour}>
              {editError && (
                <div className="labour-alert labour-alert-error" role="alert">
                  ⚠️ {editError}
                </div>
              )}

              <div className="labour-form-group">
                <label htmlFor="edit-labour-name">Labour Name</label>
                <input
                  id="edit-labour-name"
                  type="text"
                  className="labour-input"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  required
                />
              </div>

              <div className="labour-form-group">
                <label htmlFor="edit-labour-username">Username</label>
                <input
                  id="edit-labour-username"
                  type="text"
                  className="labour-input"
                  value={editUsername}
                  onChange={(event) => setEditUsername(event.target.value)}
                  required
                />
              </div>

              <div className="labour-modal-actions">
                <button
                  type="button"
                  className="labour-cancel-button"
                  onClick={cancelEditing}
                  disabled={savingEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="labour-create-button"
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default LabourManagement;

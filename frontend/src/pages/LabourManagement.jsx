
import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function LabourManagement({ user, handleCreateLabour }) {
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="labour-page">
      {/* Page Heading */}
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
    </main>
  );
}

export default LabourManagement;

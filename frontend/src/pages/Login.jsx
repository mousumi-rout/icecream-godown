
import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      if (response.ok) {
        const user = await response.json();
        onLogin(user);
      } else {
        const message = await response.text();
        setError(message || "Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>

      <section className="login-card">
        <div className="login-top-line"></div>

        <div className="login-brand">
          <div className="login-icon">🍦</div>
          <h1>Ice Cream Godown</h1>
          <p className="login-subtitle">
            INVENTORY MANAGEMENT SYSTEM
          </p>
        </div>

        <div className="login-divider"></div>

        <div className="login-welcome">
          <h2>Welcome Back!</h2>
          <p>Sign in to manage your inventory.</p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="username">Username</label>
            <div className="login-input-wrapper">
              <span className="login-field-icon">👤</span>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <span className="login-field-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>Login <span>→</span></>
            )}
          </button>
        </form>

        <div className="login-footer">
          <span>🛡️</span>
          Secure access for authorized users
        </div>
      </section>

      <p className="login-copyright">
        Ice Cream Godown · Inventory Management
      </p>
    </main>
  );
}

export default Login;

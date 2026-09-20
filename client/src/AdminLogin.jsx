import { useState } from "react";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  setError("");

  if (!email || !password) {
    setError("Email and password are required.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Invalid admin email or password"
      );
    }

    localStorage.setItem("sehgalAdminToken", data.token);

    setError("");
    onLogin();
  } catch (error) {
    setError(error.message);
  }
};
  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-logo">SEHGAL GROUP</div>

        <h1>Admin Login</h1>
        <p>Login to manage your store</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="admin-error">{error}</div>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
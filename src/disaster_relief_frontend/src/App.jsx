import { useState, useEffect } from "react";
import { initAuth, login, logout } from "./auth";

function App() {
  // State to hold the logged-in user's identity and role
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // Initialize authentication when the app loads
  useEffect(() => {
    initAuth();
  }, []);

  // Handler for logging in
  const handleLogin = async () => {
    try {
      const identity = await login();
      setUser({ principal: identity.getPrincipal().toText() });
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  // Handler for logging out
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setRole("");
    localStorage.removeItem("role");
  };

  // Handler for role selection
  const chooseRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("role", selectedRole);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Disaster Relief Coordination</h1>

      {/* If user is not logged in, show login button */}
      {!user && (
        <div>
          <button onClick={handleLogin} style={{ marginRight: "1rem" }}>
            Login with Internet Identity
          </button>
        </div>
      )}

      {/* If logged in, show user information and logout */}
      {user && (
        <div>
          <p>
            <strong>Logged in as:</strong> {user.principal}
          </p>
          <p>
            <strong>Your Role:</strong> {role ? role : "Not selected"}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* If user is logged in but has not selected a role, show role selection */}
      {user && !role && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Select Your Role:</h2>
          <button onClick={() => chooseRole("Victim")} style={{ marginRight: "1rem" }}>
            Victim
          </button>
          <button onClick={() => chooseRole("Volunteer")} style={{ marginRight: "1rem" }}>
            Volunteer
          </button>
          <button onClick={() => chooseRole("NGO")}>
            NGO
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

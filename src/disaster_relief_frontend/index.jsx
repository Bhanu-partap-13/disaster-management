import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Register from "./components/Register";
import backend from "./declarations/disaster_relief_backend";
import { AuthClient } from "@dfinity/auth-client";

const App = () => {
  const [user, setUser] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        setUser(identity);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async () => {
    if (!authClient) return;

    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setUser(identity);
      },
      onError: (err) => console.error("Login failed:", err),
    });
  };

  const handleRegister = async (role, name, email) => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    const roleEnum = role === "Victim" ? { Victim: null } :
                     role === "Volunteer" ? { Volunteer: null } :
                     { NGO: null };

    try {
      const response = await backend.registerUser(roleEnum, name, email);
      console.log("Registration Response:", response);
      setRegistered(true);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed, please try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Disaster Relief Coordination</h1>
      
      {!user ? (
        <button onClick={handleLogin}>Login with Internet Identity</button>
      ) : !registered ? (
        <Register onRegister={handleRegister} />
      ) : (
        <h2>Welcome to Disaster Relief Portal! 🎉</h2>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);

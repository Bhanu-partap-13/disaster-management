import { useState, useEffect } from "react";
import { initAuth, login, logout } from "./auth";
import MapComponent from "./components/MapComponent";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  
  // State for user-added markers and form inputs
  const [userMarkers, setUserMarkers] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    initAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const identity = await login();
      setUser({ principal: identity.getPrincipal().toText() });
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setRole("");
    localStorage.removeItem("role");
  };

  // New function: Delete user (simulate removal)
  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, call your backend/canister method to delete the user.
      // For simulation, we simply clear the user state and localStorage.
      setUser(null);
      setRole("");
      localStorage.removeItem("role");
      alert("Your account has been deleted.");
    }
  };

  const chooseRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("role", selectedRole);
  };

  // Geocode the location name using OpenStreetMap's Nominatim API
  const geocodeLocation = async (locName) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locName)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      return { lat, lon };
    } else {
      return null;
    }
  };

  // Handler for form submission to add a new marker (only for Victims)
  const handleAddMarker = async (e) => {
    e.preventDefault();

    let lat, lng;
    if (locationName && !latitude && !longitude) {
      const coords = await geocodeLocation(locationName);
      if (coords) {
        lat = coords.lat;
        lng = coords.lon;
      } else {
        alert("Location not found. Please try a different location name.");
        return;
      }
    } else {
      lat = parseFloat(latitude);
      lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng)) {
        alert("Please enter valid numeric values for latitude and longitude.");
        return;
      }
    }

    const newMarker = {
      position: [lat, lng],
      description: description || (locationName ? locationName : "User marker"),
    };

    setUserMarkers([...userMarkers, newMarker]);
    setLatitude("");
    setLongitude("");
    setDescription("");
    setLocationName("");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Disaster Relief Coordination</h1>

      {/* Authentication Section */}
      {!user && (
        <div>
          <button onClick={handleLogin} style={{ marginRight: "1rem" }}>
            Login with Internet Identity
          </button>
        </div>
      )}
      {user && (
        <div>
          <p>
            <strong>Logged in as:</strong> {user.principal}
          </p>
          <p>
            <strong>Your Role:</strong> {role || "Not selected"}
          </p>
          <button onClick={handleLogout} style={{ marginRight: "1rem" }}>
            Logout
          </button>
          <button onClick={handleDeleteUser}>
            Delete User
          </button>
        </div>
      )}
      {user && !role && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Select Your Role:</h2>
          <button onClick={() => chooseRole("Victim")} style={{ marginRight: "1rem" }}>
            Victim
          </button>
          <button onClick={() => chooseRole("Volunteer")} style={{ marginRight: "1rem" }}>
            Volunteer
          </button>
          <button onClick={() => chooseRole("NGO")}>NGO</button>
        </div>
      )}

      {/* Input Form: Only for Victims */}
      {user && role === "Victim" && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Mark Your Disaster-Prone Area / Request Aid</h2>
          <form onSubmit={handleAddMarker}>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>
                Location Name:{" "}
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Chandigarh"
                />
              </label>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              (If you provide a location name, latitude and longitude fields will be ignored.)
            </p>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>
                Latitude:{" "}
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 34.0522"
                />
              </label>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>
                Longitude:{" "}
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. -118.2437"
                />
              </label>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>
                Description:{" "}
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What do you need?"
                />
              </label>
            </div>
            <button type="submit">Add Marker</button>
          </form>
        </div>
      )}

      {user && role !== "Victim" && (
        <div style={{ marginTop: "2rem" }}>
          <h2>View Requests from Disaster-Prone Areas</h2>
          <p>
            As a <strong>{role}</strong>, you can view the locations marked by victims on the map below and offer assistance.
          </p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>Map of Disaster Zones & Resources</h2>
        <MapComponent userMarkers={userMarkers} />
      </div>
    </div>
  );
}

export default App;

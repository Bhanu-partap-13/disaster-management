import React, { useState } from "react";

const Register = ({ onRegister }) => {
  const [role, setRole] = useState("Victim");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in all details!");
      return;
    }
    onRegister(role, name, email);
  };

  return (
    <div>
      <h2>Register for Disaster Relief</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Victim">Victim</option>
            <option value="Volunteer">Volunteer</option>
            <option value="NGO">NGO</option>
          </select>
        </label>
        <br />
        <label>
          Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

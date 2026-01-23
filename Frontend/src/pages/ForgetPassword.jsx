import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="login">
      <form className="loginform" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {message && <p>{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="form-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="form-input"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="form-input"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;

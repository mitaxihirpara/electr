import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ LOGIN API
  const loginUser = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Customer not registered") {
          return { success: false, notRegistered: true };
        }
        return { success: false, message: data.message };
      }

      return { success: true, role: data.role };
    } catch (err) {
      return { success: false, message: "Backend server not running" };
    }
  };

  // ✅ REGISTER API
  const registerUser = async (username, email, password) => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: "Backend server not running" };
    }
  };

  // ✅ SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (currState === "Login") {
      const result = await loginUser(email, password);

      if (result.success) {
        localStorage.setItem("role", result.role);
        navigate(result.role === "admin" ? "/admin/dashboard" : "/");
      } else if (result.notRegistered) {
        setError("NOT_REGISTERED");
      } else {
        setError(result.message);
      }
    } else {
      const result = await registerUser(username, email, password);

      if (result.success) {
        alert("Registration successful. Please login.");
        setCurrState("Login");
        setUsername("");
        setPassword("");
      } else {
        setError(result.message);
      }
    }
  };




  return (
    <div className="login">
      <form className="loginform" onSubmit={handleSubmit}>
        <div className="login-left">
          <div className="floating-shape circle"></div>
          <div className="floating-shape square"></div>

          <h1>Welcome 👋</h1>
          <p>Login to continue your shopping experience</p>
        </div>

        <h2>{currState}</h2>

        {/* {error && <div className="error-message">{error}</div>} */}
        {error === "NOT_REGISTERED" && (
          <div className="error-message">
            <p>You are not registered yet.</p>
            <p>
              Please{" "}
              <span
                className="register-link"
                onClick={() => setCurrState("Register")}
              >
                register here
              </span>{" "}
              to continue.
            </p>
          </div>
        )}

        {error && error !== "NOT_REGISTERED" && (
          <div className="error-message">{error}</div>
        )}


        {currState === "Register" && (
          <input
            type="text"
            placeholder="username"
            className="form-input"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}


        <input
          type="email"
          placeholder="email address"
          className="form-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          className="form-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {currState === "Register" ? "Create Account" : "Login Now"}
        </button>
 

        <p
          className="login-toggle"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot / Change Password?
        </p>

        <div className="login-forget">
          {currState === "Register" ? (
            <p>
              Already have an account{" "}
              <span
                className="login-toggle"
                onClick={() =>{ setCurrState("Login"); setError("");  
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                className="login-toggle"
                onClick={() => {setCurrState("Register");
                               setError("");
                }}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;

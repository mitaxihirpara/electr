import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

    // logout
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const customerId = localStorage.getItem("customer_id");
    // const adminId = localStorage.getItem("admin_id");

    if (customerId ) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer_id");
    localStorage.removeItem("customer_name");
    // localStorage.removeItem("admin_id");
    // localStorage.removeItem("admin_name");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    navigate("/login");
  };







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
      return { success: false, message: data.message };
    }
    return { success: true, ...data };

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

    // 🔐 ADMIN LOGIN
    if (result.type === "admin") {
      localStorage.setItem("admin_id", result.admin_id);
      localStorage.setItem("admin_name", result.admin_name);
      localStorage.setItem("role", "admin"); 
      navigate("/admin/dashboard");
      return;
    }

    // 👤 CUSTOMER LOGIN
    if (result.type === "customer") {
      localStorage.setItem("customer_id", result.customer_id);
      localStorage.setItem("customer_name", result.customer_name);
      localStorage.setItem("role", "customer"); 
      navigate("/");
      return;
    }

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
  // 🔁 ALREADY LOGGED IN UI
  if (isLoggedIn) {
    return (
      <div className="login">
        <div className="loginform">
          <h2>You are already logged in ✅</h2>
          <p style={{ margin: "15px 0", color: "#555" }}>
            Want to login with another account?
          </p>
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }



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

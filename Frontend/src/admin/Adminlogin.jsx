import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginAdmin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // Read backend response
      const data = await res.json();
      console.log("Backend response:", data);

      // Check if login succeeded and role is admin
      if (data.success && data.role === "admin") {
        localStorage.setItem("role", "admin"); // save login
        navigate("/admin/dashboard"); // redirect to admin dashboard
      } else {
        alert("Invalid admin credentials or not authorized");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error, please try again later");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
<br/>
      <button onClick={loginAdmin}>Login</button>
    </div>
  );
}

export default AdminLogin;

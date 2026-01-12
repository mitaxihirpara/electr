// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import './login.css'
// import assets from "../assets/assets.js";




// const Login = () =>{
   
//     const [currState, setCurrState] = useState("Login");
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError('');
        
//         if (currState === "Login") {
//             const result = login(email, password);
//             if (result.success) {
//                 if (result.isAdmin) {
//                     navigate('/admin/dashboard');
//                 } else {
//                     navigate('/');
//                 }
//             } else {
//                 setError(result.message || 'Invalid credentials');
//             }
//         } else {
//             // Registration logic (placeholder)
//             setError('Registration functionality coming soon');
//         }
//     };




//     return(
//         <div className='login'>
//             {/* <img src={assets.logo_big} alt="" className="logo" /> */}
//             <form className="loginform" >


//             <div className="login-left">
//                 <div className="floating-shape circle"></div>
//                 <div className="floating-shape square"></div>

//                 <h1>Welcome 👋</h1>
//                 <p>Login to continue your shopping experience</p>
//                 </div>


//                 <h2>{currState}</h2>
//                 {error && <div className="error-message">{error}</div>}
//                 {currState ==="Register"?<input type="text" placeholder='username' className="form-input"required />:null}
//                 <input 
//                     type="email" 
//                     placeholder='email address' 
//                     className="form-input" 
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input 
//                     type="password" 
//                     placeholder='password' 
//                     className="form-input" 
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button type='submit'>{currState=== "Register"?"Create Account":"Login Now"}</button>
//                 <div className="login-term">
//                     <input type="checkbox" />
//                     <p>
//                         Agree to the terms of use & privacy policy.
//                     </p>
//                 </div>
//                 <div className="login-forget">
//                     {
//                         currState ==="Register"
//                         ?<p> Already have an account <span className='login-toggle' onClick={()=>setCurrState("Login")}>Login here</span></p>
//                         :<p> Create an account <span className='login-toggle' onClick={()=>setCurrState("Register")}>Click here</span></p>
//                     }
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default Login


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import assets from "../assets/assets.js";

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 API LOGIN FUNCTION
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

      return { success: true, role: data.role };
    } catch (err) {
      return { success: false, message: "Backend server not running" };
    }
  };

  // 🔹 SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (currState === "Login") {
      const result = await loginUser(email, password);

      if (result.success) {
        // Save role (optional but recommended)
        localStorage.setItem("role", result.role);

        if (result.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message || "Invalid credentials");
      }
    } else {
      setError("Registration functionality coming soon");
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

        {error && <div className="error-message">{error}</div>}

        {currState === "Register" && (
          <input
            type="text"
            placeholder="username"
            className="form-input"
            required
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

        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-forget">
          {currState === "Register" ? (
            <p>
              Already have an account{" "}
              <span
                className="login-toggle"
                onClick={() => setCurrState("Login")}
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                className="login-toggle"
                onClick={() => setCurrState("Register")}
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

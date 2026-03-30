import React, { useState } from "react";
import LoginForm from "../components/ui/LoginForm";
import "../App.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Login</h1>
        <p>Welcome Back! Log in to your account</p>
      </div>

      <div className="auth-right">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;









// import { useState } from "react";
// import { loginUser } from "../services/authService";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     try {
//       await loginUser(form);
//       navigate("/home");
//     } catch (err) {
//       console.error(err);
//       alert("Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="left">
//         <h1>Simplify management with our dashboard</h1>
//         <p>Manage your e-commerce easily</p>
//       </div>

//       <div className="right">
//         <h2>Welcome to Mercantix</h2>

//         <input
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//         />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           onChange={handleChange}
//         />

//         <button onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// }





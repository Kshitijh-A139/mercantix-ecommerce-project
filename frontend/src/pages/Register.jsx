import React from "react";
import SignUpForm from "../components/ui/SignForm";

const Register = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Create Account</h1>
        <p>Simplify management with Mercantix dashboard</p>
      </div>

      <div className="auth-right">
        <SignUpForm />
      </div>
    </div>
  );
};

export default Register;
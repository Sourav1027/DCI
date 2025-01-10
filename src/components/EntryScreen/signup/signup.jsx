import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "./signup-form/signup-form";
import Copyright from "../copyright/copyright";
import img from "../../../assets/photos/cllg.svg";
import Logo from "../../../assets/logo/logo";
import "./signup.css";

const Signup = () => {
  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section */}
        <div className="login-left-section">
          <div className="login-logo-wrapper">
              <Logo />
          </div>
          <div className="login-image-container">
            <img src={img} alt="College Illustration" className="login-image" />
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right-section">
          <div className="login-form-container">
            {/* Logo for small screens */}
            <div className="login-small-logo">
                <Logo />
            </div>

            {/* Sign-in Form */}
            <div className="login-heading">
              <h4 className="login-title">Register</h4>
              <p className="login-subtitle">Register in to your account</p>
            </div>
            <SignupForm />
            <hr className="login-divider" />
            <p className="login-register-prompt">
              Already have an account?{" "}
              <Link to="/" className="login-register-link">
                Sign in
              </Link>
            </p>
          </div>
          <div className="login-copyright">
            <Copyright />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

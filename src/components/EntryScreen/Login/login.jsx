import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./login-form/loginform";
import Copyright from "../copyright/copyright";
import img from "../../../assets/photos/cllg.svg";
import Logo from "../../../assets/logo/logo";
import "./login.css";

const Login = () => {
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
              <h4 className="login-title">Sign in</h4>
              <p className="login-subtitle">Sign in to your account</p>
            </div>
            <LoginForm />
            <hr className="login-divider" />
          </div>
          <div className="login-copyright">
            <Copyright />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

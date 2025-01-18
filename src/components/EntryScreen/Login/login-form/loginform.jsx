import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import "./loginform.css";

const apiUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000/v1/';

const schema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: '',
    severity: 'error'
  });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const showAlert = (message, severity = 'error') => {
    setAlertInfo({
      show: true,
      message,
      severity
    });

    setTimeout(() => {
      setAlertInfo(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log(result); // Log response to inspect the result
  
      if (!response.ok) {
        showAlert(result.message || "Login failed. Please try again.", "error");
        return;
      }
  
      const token = result.token;
      if (!token) {
        showAlert("Login failed: Authentication token not received", "error");
        return;
      }
  
      localStorage.setItem("token", token);
      console.log("Setting token:", localStorage.setItem("token", token)); // Log the token

  
      showAlert("Successfully logged in!", "success");
  
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (err) {
      showAlert(err.message || "An error occurred while logging in. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Alert Container Styles
  const alertContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  };

  // Alert Styles
  const alertStyle = {
    width: '80%',
    maxWidth: '800px',
    fontSize: '1.1rem',
    padding: '12px 24px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  return (
    <>
      {/* Alert Component */}
      {alertInfo.show && (
        <div style={alertContainerStyle}>
          <Alert 
            severity={alertInfo.severity}
            style={alertStyle}
          >
            {alertInfo.message}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        {/* Email Field */}
        <div className="login-group">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <div className="input-wrapper">
                    <span className="input-icon">
                        <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                        type="text"
                        id="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        disabled={isLoading}
                        {...register("email")}
                    />
                </div>
                {errors.email && (
                    <div className="error-message">{errors.email.message}</div>
                )}
            </div>

        {/* Password Field */}
         {/* Password Field */}
         <div className="login-group">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <div className="input-wrapper">
                    <span className="input-icon">
                        <i className="fa-solid fa-key"></i>
                    </span>
                    <input
                        type={passwordType}
                        id="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        disabled={isLoading}
                        {...register("password")}
                    />
                    <span className="password-toggle-icon" onClick={togglePasswordType}>
                        <i className={`fa-solid ${passwordType === "password" ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </span>
                </div>
                {errors.password && (
                    <div className="error-message">{errors.password.message}</div>
                )}
            </div>

        {/* Remember Me and Forgot Password */}
        <div className="form-options">
          <div className="remember-me">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              {...register("rememberMe")}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Keep Me Signed In
            </label>
          </div>
          <a href="/auth/forgot-password" className="forgot-password-link">
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Signing in...
            </>
          ) : (
            <>
              <i className="fa-solid fa-sign-in-alt"></i> Sign In
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
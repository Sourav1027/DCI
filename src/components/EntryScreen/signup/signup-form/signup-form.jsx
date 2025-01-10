import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import "./signupform.css";

const apiUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/api/auth/";

const schema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  username: z.string().min(1, { message: "User Name is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "error",
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
      username: "",
      email: "",
      password: "",
    },
  });

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const showAlert = (message, severity = "error") => {
    setAlertInfo({
      show: true,
      message,
      severity,
    });

    setTimeout(() => {
      setAlertInfo((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert(
          result.message || "Register failed. Please try again.",
          "error"
        );
        return;
      }

      const token = result.token;
      if (!token) {
        showAlert(
          "Register failed: Authentication token not received",
          "error"
        );
        return;
      }

      localStorage.setItem("auth_token", token);
      showAlert("Successfully Registered !", "success");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      showAlert(
        err.message || "An error occurred while logging in. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Alert Container Styles
  const alertContainerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  };

  // Alert Styles
  const alertStyle = {
    width: "80%",
    maxWidth: "800px",
    fontSize: "1.1rem",
    padding: "12px 24px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  };

  return (
    <>
      {/* Alert Component */}
      {alertInfo.show && (
        <div style={alertContainerStyle}>
          <Alert severity={alertInfo.severity} style={alertStyle}>
            {alertInfo.message}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        {/* Email Field */}
        <div className="form-group" style={{ width: "100%" }}>
          <label htmlFor="email" className="form-label">
            Username
          </label>
          <div className="input-group flex-nowrap" style={{ width: "30rem" }}>
            <span className="input-group-text">
              <i className="fa-solid fa-user-tie"></i>
            </span>
            <input
              type="text"
              id="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              disabled={isLoading}
              {...register("username")}
            />
          </div>
          {errors.username && (
            <div className="error-message">{errors.username.message}</div>
          )}
        </div>
        <div className="form-group" style={{ width: "100%" }}>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="input-group flex-nowrap" style={{ width: "30rem" }}>
            <span className="input-group-text">
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
        <div className="form-group" style={{ width: "100%" }}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div
            className="input-group flex-nowrap"
            style={{ width: "30rem", borderRadius: 20 }}
          >
            <span className="input-group-text">
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
              <i
                className={`fa-solid ${passwordType === "password" ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </span>
          </div>
          {errors.password && (
            <div className="error-message">{errors.password.message}</div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Signing in...
            </>
          ) : (
            <>
              <i className="fa-solid fa-sign-in-alt"></i> Sign Up
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default SignupForm;

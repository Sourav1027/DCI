import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import "./loginform.css";

const schema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
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

  const onSubmit = async (data) => {
    // Commented out API logic for now
    /*
    setIsLoading(true);
    try {
      const response = await fetch(`${apiurl}v1/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message || "Login failed");
        return;
      }

      const token = result.jwt;
      if (!token) {
        throw new Error("Token is missing from the API response");
      }

      localStorage.setItem("auth_token", token);
      alert("Successfully logged in");
    } catch (err) {
      console.error("Error during login:", err);
      alert(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
    */

    // Directly navigate to the dashboard
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      {/* Email Field */}
      <div className="form-group" style={{width:"100%"}}>
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <div class="input-group flex-nowrap"   style={{ width: "30rem" }}>
          <span class="input-group-text">
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
      <div className="form-group" style={{width:"100%"}}>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div class="input-group flex-nowrap" style={{ width: "30rem", borderRadius:20 }}>
          <span class="input-group-text">
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
  );
};

export default LoginForm;

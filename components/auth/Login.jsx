// app/login/page.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else {
      // Check for at least one uppercase letter
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
        isValid = false;
      }
      // Check for at least one lowercase letter
      else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
        isValid = false;
      }
      // Check for at least one number
      else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
        isValid = false;
      }
      // Check for at least one special character
      else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one special character (@$!%*?&)";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (submitError) {
      setSubmitError("");
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitError(data?.error || "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setSubmitError("Unable to login right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time password validation for visual feedback
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: "#e5e7eb", text: "Very Weak" };

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    // Determine strength level
    if (score <= 2) return { strength: 25, color: "#ef4444", text: "Weak" };
    if (score <= 4) return { strength: 50, color: "#f59e0b", text: "Fair" };
    if (score <= 6) return { strength: 75, color: "#3b82f6", text: "Good" };
    return { strength: 100, color: "#10b981", text: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back!</h2>
          <p style={styles.subtitle}>
            Sign in with your Username and Password.
          </p>
        </div>

        {/* Login Form */}
        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            {/* Username Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  ...(touched.username && errors.username
                    ? styles.inputError
                    : {}),
                }}
                placeholder="Enter your username"
              />
              {touched.username && errors.username && (
                <div style={styles.errorText}>{errors.username}</div>
              )}
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  ...(touched.password && errors.password
                    ? styles.inputError
                    : {}),
                }}
                placeholder="Enter your password"
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={styles.passwordStrengthContainer}>
                  <div style={styles.passwordStrengthBar}>
                    <div
                      style={{
                        ...styles.passwordStrengthFill,
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <div style={styles.passwordStrengthText}>
                    Password Strength:{" "}
                    <span
                      style={{
                        color: passwordStrength.color,
                        fontWeight: "bold",
                      }}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div style={styles.passwordRequirements}>
                <p style={styles.requirementsTitle}>Password must contain:</p>
                <ul style={styles.requirementsList}>
                  <li
                    style={
                      formData.password.length >= 6
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    At least 6 characters
                  </li>
                  <li
                    style={
                      /[A-Z]/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    One uppercase letter
                  </li>
                  <li
                    style={
                      /[a-z]/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    One lowercase letter
                  </li>
                  <li
                    style={
                      /\d/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    One number
                  </li>
                  <li
                    style={
                      /[@$!%*?&]/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>

              {touched.password && errors.password && (
                <div style={styles.errorText}>{errors.password}</div>
              )}
            </div>

            {/* Forgot Password */}
            <div style={styles.forgotPassword}>
              <a href="#" style={styles.link}>
                Forget Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          {submitError && <div style={styles.errorText}>{submitError}</div>}
          <button
            type="submit"
            style={styles.loginButton}
            disabled={!formData.username || !formData.password || isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or login with</span>
        </div>

        {/* Social Login Buttons */}
        <div style={styles.socialButtons}>
          <button
            type="button"
            onClick={() => setSubmitError("Google login is not configured yet.")}
            style={styles.socialButton}
          >
            <svg style={styles.googleIcon} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => setSubmitError("Facebook login is not configured yet.")}
            style={styles.socialButton}
          >
            <svg style={styles.facebookIcon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        {/* Register Link */}
        <div style={styles.registerLink}>
          <p>
            Do not have an account?{" "}
            <Link href="/signup" style={styles.registerText}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Add inline styles */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        body {
          font-family: "Inter", sans-serif;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    maxWidth: "28rem",
    width: "100%",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0,
  },
  subtitle: {
    marginTop: "0.5rem",
    color: "#6b7280",
    margin: 0,
  },
  form: {
    marginTop: "2rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  inputGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.2)",
  },
  inputFocus: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
  },
  forgotPassword: {
    textAlign: "right",
  },
  link: {
    fontSize: "0.875rem",
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "none",
  },
  loginButton: {
    width: "100%",
    padding: "0.75rem",
    background: "linear-gradient(to right, #2563eb, #1d4ed8)",
    color: "white",
    fontWeight: "500",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "all 0.2s",
    marginBottom: "0.5rem",
  },
  loginButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
    fontWeight: "500",
  },
  passwordStrengthContainer: {
    marginTop: "0.5rem",
  },
  passwordStrengthBar: {
    height: "0.25rem",
    backgroundColor: "#e5e7eb",
    borderRadius: "0.125rem",
    overflow: "hidden",
    marginBottom: "0.25rem",
  },
  passwordStrengthFill: {
    height: "100%",
    transition: "width 0.3s ease, background-color 0.3s ease",
  },
  passwordStrengthText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  passwordRequirements: {
    marginTop: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
  },
  requirementsTitle: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 0.5rem 0",
  },
  requirementsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  requirement: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    marginBottom: "0.25rem",
    display: "flex",
    alignItems: "center",
  },
  requirementMet: {
    fontSize: "0.75rem",
    color: "#10b981",
    marginBottom: "0.25rem",
    display: "flex",
    alignItems: "center",
  },
  requirement: {
    position: "relative",
    paddingLeft: "1rem",
  },
  requirementMet: {
    position: "relative",
    paddingLeft: "1rem",
  },
  requirement: {
    position: "relative",
    paddingLeft: "1rem",
  },
  requirementMet: {
    position: "relative",
    paddingLeft: "1rem",
  },
  requirement: {
    position: "relative",
    paddingLeft: "1rem",
  },
  requirementMet: {
    position: "relative",
    paddingLeft: "1rem",
  },
  divider: {
    position: "relative",
    margin: "1.5rem 0",
  },
  dividerLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor: "#d1d5db",
  },
  dividerText: {
    position: "relative",
    backgroundColor: "white",
    padding: "0 1rem",
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  socialButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    transition: "all 0.2s",
  },
  googleIcon: {
    width: "1.25rem",
    height: "1.25rem",
  },
  facebookIcon: {
    width: "1.25rem",
    height: "1.25rem",
    color: "#2563eb",
  },
  registerLink: {
    textAlign: "center",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  registerText: {
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "none",
  },
};


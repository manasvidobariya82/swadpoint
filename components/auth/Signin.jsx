// app/register/page.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const SPECIAL_CHAR_REGEX = /[@$!%*?&]/;

const getStoredUsers = () => [];

const validateField = (name, value, formData, users) => {
  const normalizedUsers = Array.isArray(users) ? users : [];
  const username = String(formData.username || "").trim();
  const email = String(formData.email || "").trim();
  const password = String(formData.password || "");
  const confirmPassword = String(formData.confirmPassword || "");

  switch (name) {
    case "username": {
      if (!username) return "Username is required";
      if (username.length < 3) return "Username must be at least 3 characters";
      if (username.length > 30) return "Username must be less than 30 characters";
      if (!USERNAME_REGEX.test(username)) {
        return "Username can contain only letters, numbers, and underscore";
      }

      const exists = normalizedUsers.some(
        (u) =>
          String(u?.username || "").trim().toLowerCase() ===
          username.toLowerCase()
      );
      if (exists) return "Username already exists";
      return "";
    }

    case "email": {
      if (!email) return "Email is required";
      if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
      if (email.length > 120) return "Email is too long";

      const exists = normalizedUsers.some(
        (u) =>
          String(u?.email || "").trim().toLowerCase() === email.toLowerCase()
      );
      if (exists) return "Email already registered";
      return "";
    }

    case "password": {
      if (!password.trim()) return "Password is required";
      if (password.length < 8) return "Password must be at least 8 characters";
      if (password.length > 64) return "Password must be less than 64 characters";
      if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
      }
      if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
      }
      if (!/\d/.test(password)) return "Password must contain at least one number";
      if (!SPECIAL_CHAR_REGEX.test(password)) {
        return "Password must contain at least one special character (@$!%*?&)";
      }
      return "";
    }

    case "confirmPassword": {
      if (!confirmPassword.trim()) return "Please confirm your password";
      if (password !== confirmPassword) return "Passwords do not match";
      return "";
    }

    case "agreeTerms": {
      if (!formData.agreeTerms) {
        return "You must agree to the terms and conditions";
      }
      return "";
    }

    default:
      return "";
  }
};

const validateAllFields = (formData) => {
  const users = getStoredUsers();
  return {
    username: validateField("username", formData.username, formData, users),
    email: validateField("email", formData.email, formData, users),
    password: validateField("password", formData.password, formData, users),
    confirmPassword: validateField(
      "confirmPassword",
      formData.confirmPassword,
      formData,
      users
    ),
    agreeTerms: validateField("agreeTerms", formData.agreeTerms, formData, users),
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isFormValid = useMemo(() => {
    const validationResult = validateAllFields(formData);
    return Object.values(validationResult).every((errorMessage) => !errorMessage);
  }, [formData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(nextFormData);
    if (submitError) {
      setSubmitError("");
    }

    if (touched[name]) {
      const users = getStoredUsers();
      const fieldError = validateField(name, nextFormData[name], nextFormData, users);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    } else if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "password" && touched.confirmPassword) {
      const users = getStoredUsers();
      const confirmError = validateField(
        "confirmPassword",
        nextFormData.confirmPassword,
        nextFormData,
        users
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }
  };

  // Handle field blur (when user leaves a field)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const users = getStoredUsers();
    const fieldError = validateField(name, formData[name], formData, users);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextTouched = {
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    };
    setTouched(nextTouched);

    const validationResult = validateAllFields(formData);
    setErrors(validationResult);

    const hasErrors = Object.values(validationResult).some(
      (errorMessage) => Boolean(errorMessage)
    );
    if (hasErrors) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data?.error || "Failed to create account";
        setSubmitError(message);
        if (/username/i.test(message) || /email/i.test(message)) {
          setErrors((prev) => ({
            ...prev,
            username: /username/i.test(message) ? message : prev.username,
            email: /email/i.test(message) ? message : prev.email,
          }));
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setSubmitError("Unable to create account right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength calculator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, color: "#e5e7eb", text: "" };

    let score = 0;

    // Length
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;

    // Character types
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[@$!%*?&]/.test(password)) score += 5;

    // Cap at 100
    score = Math.min(score, 100);

    // Determine color and text
    let color = "#e5e7eb";
    let text = "Very Weak";

    if (score >= 25) {
      color = "#ef4444";
      text = "Weak";
    }
    if (score >= 50) {
      color = "#f59e0b";
      text = "Fair";
    }
    if (score >= 75) {
      color = "#3b82f6";
      text = "Good";
    }
    if (score >= 90) {
      color = "#10b981";
      text = "Strong";
    }

    return { strength: score, color, text };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>
            Sign up to get started with our platform
          </p>
        </div>

        {/* Registration Form */}
        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            {/* Username Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username *</label>
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
                  ...(touched.username && !errors.username
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="Enter username (min 3 characters)"
              />
              {touched.username && errors.username && (
                <div style={styles.errorText}>{errors.username}</div>
              )}
            </div>

            {/* Email Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  ...(touched.email && errors.email ? styles.inputError : {}),
                  ...(touched.email && !errors.email ? styles.inputValid : {}),
                }}
                placeholder="Enter your email"
              />
              {touched.email && errors.email && (
                <div style={styles.errorText}>{errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password *</label>
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
                  ...(touched.password && !errors.password
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="Create a password"
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
                    {passwordStrength.text && (
                      <>
                        Strength:{" "}
                        <span
                          style={{
                            color: passwordStrength.color,
                            fontWeight: "bold",
                          }}
                        >
                          {passwordStrength.text}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div style={styles.passwordRequirements}>
                <div style={styles.requirementItem}>
                  <span
                    style={
                      formData.password.length >= 8
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    {formData.password.length >= 8 ? "✓" : "•"} At least 8
                    characters
                  </span>
                </div>
                <div style={styles.requirementItem}>
                  <span
                    style={
                      /[A-Z]/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    {/[A-Z]/.test(formData.password) ? "✓" : "•"} One uppercase
                    letter
                  </span>
                </div>
                <div style={styles.requirementItem}>
                  <span
                    style={
                      /[a-z]/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    {/[a-z]/.test(formData.password) ? "✓" : "•"} One lowercase
                    letter
                  </span>
                </div>
                <div style={styles.requirementItem}>
                  <span
                    style={
                      /\d/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    {/\d/.test(formData.password) ? "✓" : "•"} One number
                  </span>
                </div>
                <div style={styles.requirementItem}>
                  <span
                    style={
                      /[@$!%*?&]/.test(formData.password)
                        ? styles.requirementMet
                        : styles.requirement
                    }
                  >
                    {/[@$!%*?&]/.test(formData.password) ? "✓" : "•"} One
                    special character (@$!%*?&)
                  </span>
                </div>
              </div>

              {touched.password && errors.password && (
                <div style={styles.errorText}>{errors.password}</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  ...(touched.confirmPassword && errors.confirmPassword
                    ? styles.inputError
                    : {}),
                  ...(touched.confirmPassword && !errors.confirmPassword
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="Re-enter your password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div style={styles.errorText}>{errors.confirmPassword}</div>
              )}
              {touched.confirmPassword &&
                !errors.confirmPassword &&
                formData.confirmPassword && (
                  <div style={styles.successText}>✓ Passwords match</div>
                )}
            </div>

            {/* Terms and Conditions */}
            <div style={styles.termsContainer}>
              <div style={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={styles.checkbox}
                />
                <label htmlFor="agreeTerms" style={styles.termsLabel}>
                  I agree to the{" "}
                  <a href="/terms" style={styles.termsLink}>
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" style={styles.termsLink}>
                    Privacy Policy
                  </a>
                </label>
              </div>
              {touched.agreeTerms && errors.agreeTerms && (
                <div style={styles.errorText}>{errors.agreeTerms}</div>
              )}
            </div>
          </div>

          {/* Register Button */}
          {submitError && <div style={styles.errorText}>{submitError}</div>}
          <button
            type="submit"
            style={{
              ...styles.registerButton,
              ...(!isFormValid || isSubmitting ? styles.buttonDisabled : {}),
            }}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          {/* Quick test button (remove in production) */}
          <div style={styles.testSection}>
            <p style={styles.testText}>
              For testing: Fill form with valid data then click Create Account
            </p>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  username: formData.username,
                  email: formData.email,
                  password: formData.password,
                  confirmPassword: formData.confirmPassword,
                  agreeTerms: formData.agreeTerms,
                });
              }}
              style={styles.testButton}
            >
              Auto-fill Test Data
            </button>
          </div>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or sign up with</span>
        </div>

        {/* Social Sign Up Buttons */}
        <div style={styles.socialButtons}>
          {/* Google Sign Up */}
          <button
            type="button"
            onClick={() => {
              setSubmitError("Google signup is not configured yet.");
            }}
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

          {/* Facebook Sign Up */}
          <button
            type="button"
            onClick={() => {
              setSubmitError("Facebook signup is not configured yet.");
            }}
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

        {/* Login Link */}
        <div style={styles.loginLink}>
          <p>
            Already have an account?{" "}
            <Link href="/login" style={styles.loginText}>
              Sign In Now
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
    fontFamily: "'Inter', sans-serif",
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
    boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.1)",
  },
  inputValid: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.1)",
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
  requirementItem: {
    marginBottom: "0.25rem",
  },
  requirement: {
    fontSize: "0.75rem",
    color: "#9ca3af",
  },
  requirementMet: {
    fontSize: "0.75rem",
    color: "#10b981",
    fontWeight: "500",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
    fontWeight: "500",
  },
  successText: {
    color: "#10b981",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
    fontWeight: "500",
  },
  termsContainer: {
    marginTop: "1rem",
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "flex-start",
  },
  checkbox: {
    marginTop: "0.25rem",
    marginRight: "0.5rem",
  },
  termsLabel: {
    fontSize: "0.875rem",
    color: "#374151",
    lineHeight: "1.4",
  },
  termsLink: {
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "none",
  },
  registerButton: {
    width: "100%",
    padding: "0.75rem",
    background: "linear-gradient(to right, #059669, #047857)",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s",
    marginTop: "1rem",
  },
  buttonDisabled: {
    opacity: "0.5",
    cursor: "not-allowed",
  },
  testSection: {
    marginTop: "1rem",
    textAlign: "center",
  },
  testText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  testButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    cursor: "pointer",
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
  loginLink: {
    textAlign: "center",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  loginText: {
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "none",
  },
};


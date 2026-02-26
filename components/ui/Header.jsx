// app/components/Header.js
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Button from "./Button";

export default function Header({ isAuthenticated = false, user }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // Navigation items
  const navItems = [
    { name: "Home", href: "/welcome" },
    { name: "Features", href: "/features" },
    // { name: "Solutions", href: "/solutions" },
    { name: "Plan", href: "/plan" },
    { name: "About Us", href: "/about-us" },
    // { name: "career", href: "/career" },
  ];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user's first letter for avatar
  const getAvatarLetter = () => {
    console.log("user?.name", user?.name); // Fixed: user?.name

    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "A";
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("username");

    // Redirect to login
    router.push("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        {/* Logo */}
        <div style={styles.logo}>SwadPoint</div>

        {/* Navigation for non-authenticated users */}
        {!isAuthenticated && (
          <nav style={styles.navigation}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  ...styles.navItem,
                  ...(pathname === item.href ? styles.activeNavItem : {}),
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <div style={styles.rightSection}>
        {!isAuthenticated ? (
          <>
            <Button variant="primary" onClick={() => router.push("/login")}>
              Log in
            </Button>
            {/* <Button variant="text">Request A Demo</Button> */}
          </>
        ) : (
          <div style={styles.authSection} ref={dropdownRef}>
            {/* User name */}
            <span style={styles.userGreeting}>
              Hello, {user?.name || user?.username || "Admin"}
            </span>

            {/* Avatar with dropdown */}
            <div style={styles.avatarContainer}>
              <button onClick={toggleDropdown} style={styles.avatarButton}>
                {getAvatarLetter()}
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div style={styles.dropdownMenu}>
                  <button
                    onClick={handleLogout}
                    style={{ ...styles.dropdownItem, ...styles.logoutItem }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    width: "100%",
    height: "64px",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "48px", // Increased gap to accommodate navigation
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2563eb",
    lineHeight: 1,
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  navItem: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  activeNavItem: {
    color: "#2563eb",
    backgroundColor: "#eff6ff",
    fontWeight: "600",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    position: "relative",
  },
  userGreeting: {
    fontSize: "14px",
    color: "#6b7280",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarButton: {
    width: "36px",
    height: "36px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    width: "192px",
    backgroundColor: "white",
    borderRadius: "6px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "4px 0",
    border: "1px solid #e5e7eb",
    zIndex: 50,
  },
  dropdownItem: {
    width: "100%",
    textAlign: "left",
    padding: "8px 16px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  logoutItem: {
    color: "#dc2626",
  },
};

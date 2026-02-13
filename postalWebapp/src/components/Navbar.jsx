import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";   // 👈 IMPORT IMAGE
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/categories", label: "Categories" },
    { path: "/forms", label: "Forms" },
    { path: "/documents", label: "Documents" },
  ];

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="brand">
        <img src={logo} alt="Postal Portal Logo" className="brand-logo" />
        <h2 className="brand-title">Postal Portal</h2>
      </div>

      {/* Desktop Links */}
      <div className="nav-links desktop">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${
              location.pathname === link.path ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? "show" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`drawer-link ${
              location.pathname === link.path ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import "../../Styles/Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo1.png" alt="Devang Tours Logo" className="logo" />
        <h2 className="brand-name">Devang Tours & Travels</h2>
      </div>

      {/* Desktop Nav */}
      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#gallery" onClick={closeMenu}>Gallery</a>
        <a href="#reviews" onClick={closeMenu}>Reviews</a>
        <a href="#booking" className="book-btn" onClick={closeMenu}>Book Now</a>
        <Link to="/admin" className="admin-link" onClick={closeMenu}>Admin</Link>
      </nav>

      {/* Hamburger */}
      <button
        type="button"
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

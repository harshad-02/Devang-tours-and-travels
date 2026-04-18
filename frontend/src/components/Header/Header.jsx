import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../Styles/Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
  const sectionLink = (sectionId) => (pathname === "/" ? `#${sectionId}` : `/#${sectionId}`);

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo1.png" alt="Devang Tours Logo" className="logo" />
        <h2 className="brand-name">Devang Tours & Travels</h2>
      </div>

      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href={sectionLink("home")} onClick={closeMenu}>Home</a>
        <a href={sectionLink("gallery")} onClick={closeMenu}>Gallery</a>
        <a href={sectionLink("reviews")} onClick={closeMenu}>Reviews</a>
        <a href={sectionLink("booking")} className="book-btn" onClick={closeMenu}>Book Now</a>
        <Link to="/admin" className="admin-link" onClick={closeMenu}>Admin</Link>
      </nav>

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

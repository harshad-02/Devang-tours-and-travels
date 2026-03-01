import { useState } from "react";
import { Link } from "react-router-dom";
import "../../Styles/Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo1.png" alt="Devang Tours Logo" className="logo" />
        <h2 className="brand-name">Devang Tours & Travels</h2>
      </div>

      {/* Desktop Nav */}
      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="#home">Home</a>
        <a href="#gallery">Gallery</a>
        <a href="#reviews">Reviews</a>
        <a href="#booking" className="book-btn">Book Now</a>
        <Link to="/admin" className="admin-link">Admin</Link>
      </nav>

      {/* Hamburger */}
      <div 
        className="hamburger" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>
    </header>
  );
}

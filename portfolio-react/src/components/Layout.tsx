import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ThemeMenu from "./ThemeMenu";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/skills", label: "Skills" },
  { path: "/games", label: "Games" },
  { path: "/contact", label: "Contact" },
  { path: "/settings", label: "Settings" },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = () => {
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar">
          <NavLink to="/" className="nav-logo" onClick={handleNavigate}>
            Maiwand
          </NavLink>
          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={handleNavigate}
                end={link.path === "/"}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="nav-theme">
              <ThemeMenu />
            </div>
          </div>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          &copy; {new Date().getFullYear()} Maiwand Dzirmal. Made with ❤️ and
          curiosity.
        </p>
      </footer>
    </div>
  );
}

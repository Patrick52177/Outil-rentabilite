import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/layout.css";

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconPackage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconDollar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconTrending = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Données", icon: IconHome },
    { path: "/produits", label: "Produits", icon: IconPackage },
    { path: "/coût-unitaire", label: "Coût unitaire", icon: IconDollar },
    { path: "/marge", label: "Marge", icon: IconTrending },
    { path: "/simulation", label: "Historique", icon: IconHistory },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <aside id="sidebar" className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        {/* Header */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#e30613" />
                <path d="M7 12h10M7 8h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title">Outil</div>
              <div className="brand-subtitle">Rentabilité</div>
            </div>
          </div>
          <button className="btn-close-sidebar" onClick={onClose}>
            <IconX />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-divider"></div>
          <p className="footer-text">© {new Date().getFullYear()} • CEM</p>
        </div>
      </div>
    </aside>
  );
}

import "../../assets/css/layout.css";

const IconPanelLeftClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="14" y1="9" x2="19" y2="12" />
    <line x1="14" y1="15" x2="19" y2="12" />
  </svg>
);

const IconPanelLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="14" y1="12" x2="19" y2="9" />
    <line x1="14" y1="12" x2="19" y2="15" />
  </svg>
);

export default function Topbar({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="topbar">
      {!sidebarOpen && (
        <div className="topbar-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#e30613" />
            <path d="M7 12h10M7 8h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <button className="btn-toggle-sidebar" onClick={onToggleSidebar} title="Basculer la barre latérale">
        {sidebarOpen ? <IconPanelLeftClose /> : <IconPanelLeft />}
      </button>

      <div className="topbar-title">
        <img src="../images/CEM.png" alt="CEM" style={{ height: "40px" }} />
      </div>

      <div className="topbar-actions">
        <div className="user-avatar">
          <span>U</span>
        </div>
      </div>
    </header>
  );
}

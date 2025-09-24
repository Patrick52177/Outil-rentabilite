export default function Topbar({ onOpenSidebar }) {
  return (
    <header className="topbar shadow-sm p-2 d-flex align-items-center">
      {/* Bouton hamburger visible seulement en mobile */}
      <button className="btn btn-ghost d-lg-none me-2" onClick={onOpenSidebar}>
        ☰
      </button>

      <div className="logo">
        <img src="/images/CEM.png" alt="Logo" style={{ height: "32px" }} />
      </div>
      <div className="ms-auto"></div>
    </header>
  );
}

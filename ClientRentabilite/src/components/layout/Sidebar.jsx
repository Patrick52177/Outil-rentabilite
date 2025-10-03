import { Link } from "react-router-dom";



export default function Sidebar({ isOpen, onClose }) {
  return (
   <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="brand">
         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                        <rect width="24" height="24" rx="6" fill="#fff5f5" />
                        <path d="M7 12h10M7 8h6" stroke="red" stroke-width="1.4" stroke-linecap="round"/>
                    </svg>Outil Rentabilité
        </div>
          <button className="btn-close-sidebar d-lg-none" onClick={onClose}>
          ✕
        </button>
                    
      <nav>
        <Link to="/" className="nav-link" onClick={onClose}>Accueil</Link>
        <Link to="/produits" className="nav-link" onClick={onClose}>Produits</Link>
        <Link to="/coût-unitaire" className="nav-link" onClick={onClose}>Coût unitaire</Link>
        <Link to="/marge" className="nav-link" onClick={onClose}>Marge</Link>
        <Link to="/simulation" className="nav-link" onClick={onClose}>Simulation</Link>
      </nav>
      <div className="mt-auto small">© {new Date().getFullYear()} • CEM</div>
    </aside>
  );
}

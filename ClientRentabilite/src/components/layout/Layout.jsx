import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-root">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay (sombre quand sidebar est ouverte en mobile) */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Zone principale */}
      <div className="main-area">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

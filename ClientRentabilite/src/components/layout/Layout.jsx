import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../assets/css/layout.css";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      // Sidebar ouverte sur desktop, fermée sur mobile
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-root">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Overlay visible uniquement sur mobile */}
      {isMobile && sidebarOpen && (
        <div className="overlay" onClick={closeSidebar}></div>
      )}

      {/* Zone principale */}
      <div
        className={`main-area ${
          sidebarOpen && !isMobile ? "sidebar-visible" : "sidebar-hidden"
        }`}
      >
        <Topbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

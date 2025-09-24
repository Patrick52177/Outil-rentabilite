import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Sidebar from "./components/layout/Sidebar";
import ProduitsPage from "./components/produits/ProduitsPage";
import CreateProduit from "./components/produits/CreateProduit";
import Actions from "./components/actions/Actions";
import Employes from "./components/employes/Employes";


/*import Home from "./pages/Home";
import Produits from "./pages/Produits";
import Employes from "./pages/Employes";
import Actions from "./pages/Actions";
import Simulation from "./pages/Simulation";*/

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
            <Route path="/" element={<h2>Accueil</h2>} />
            <Route path="/produits" element={<ProduitsPage />} />
            <Route path="/actions" element={<Actions/>} />
            <Route path="/employes" element={<Employes/>} />
            <Route path="/produits/nouveau" element={<CreateProduit />} />
          </Routes>
      </Layout>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Sidebar from "./components/layout/Sidebar";
import ProduitsPage from "./components/produits/ProduitsPage";
import CreateProduit from "./components/produits/CreateProduit";
import ChoisirProduit from "./components/actions/ChoisirProduit"
import CoutUnitaire from "./components/actions/CoutUnitaire"
import Employes from "./components/employes/Employes";
import Marge from "./components/marge/Marge";
import TauxMarchePage from "./components/donne/tauxMarchePage";

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
            <Route path="/" element={<TauxMarchePage />} />
            <Route path="/produits" element={<ProduitsPage />} />
            <Route path="/coût-unitaire" element={<ChoisirProduit/>} />
            <Route path="/coût-unitaire/:id" element={<CoutUnitaire/>} />
            <Route path="/employes" element={<Employes/>} />
            <Route path="/produits/nouveau" element={<CreateProduit />} />
            <Route path="/marge" element={<Marge />} />
          </Routes>
      </Layout>
    </Router>
  );
}

export default App;

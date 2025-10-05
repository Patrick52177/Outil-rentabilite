import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import {
  getProduitById,
  updateActionProduit,
  updateParametresGeneraux,
  getCoutUnitairePartiel,
} from "../../services/produitService";

export default function CoutUnitaire() {

  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [charges, setCharges] = useState({
    livretPa: 0,
    bordereau: 0,
    informatique: 0,
    communication: 0,
  });
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error , setError] = useState(null);

  // Charger les données du produit
  useEffect(() => {
    setError(null);
    setLoading(true);

    getProduitById(id).then((data)=>{
      if(!data || !data.id){
        setError("Produit introuvable");
        setProduit(null);
      }else {
        setProduit(data);
      }
    }).catch((err) => {
      console.error("Erreur lors du chargement :", err);
      setError("Impossible de charger le produit");
    }).finally(()=>setLoading(false));

    const chargerProduit = async () => {
      setLoading(true);
      try {
        const data = await getProduitById(id);
        setProduit(data);

        if (data.parametresGenerauxProduit) {
          setCharges({
            livretPa: data.parametresGenerauxProduit.livretPa || 0,
            bordereau: data.parametresGenerauxProduit.bordereau || 0,
            informatique: data.parametresGenerauxProduit.informatique || 0,
            communication: data.parametresGenerauxProduit.communication || 0,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit :", error);
      } finally {
        setLoading(false);
      }
    };

    
    chargerProduit();
  }, [id]);

  // ✅ Modifier un champ d'action
  const handleChangeAction = (index, field, value) => {
    const updatedActions = [...produit.actions];
    updatedActions[index][field] = Number(value);
    setProduit({ ...produit, actions: updatedActions });
  };

  // ✅ Modifier charges directes
  const handleChangeCharge = (e) => {
    setCharges({
      ...charges,
      [e.target.name]: Number(e.target.value),
    });
  };

  // ✅ Sauvegarde côté serveur
  const handleSaveAll = async () => {
    try {
      for (let action of produit.actions) {
        await updateActionProduit(action.id, action);
      }
      await updateParametresGeneraux(produit.id, charges);
      alert("Mise à jour effectuée avec succès !");
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
      console.error(error);
    }
  };

  // ✅ Calcul local du coût unitaire partiel
  const handleCalculer = async () => {
    try {
      const data = await getCoutUnitairePartiel(produit.id);
      setResultat(data);
    } catch (error) {
      console.error("Erreur lors du calcul du coût partiel :", error);
    }
  };

  if (loading) return <>Chargement...</>;
  if (error || !produit) return <>Produit introuvable</>;

  return (
    <>
      <div className="container mt-4">
        <h3 className="mb-4 text-center">
          Coût unitaire – <strong>{produit.nom}</strong>
 
        </h3>
     <Link to="/employes" className="btn btn-outline-secondary">
          <i className="bi bi-person-gear me-2"></i>
          Modifier coûts personnels
        </Link>
        {/* Table des actions */}
        <h5 className="mt-3">Détails des actions</h5>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nom de l’action</th>
              <th>Employé</th>
              <th>Minutes / action</th>
              <th>Nombre d’actions</th>
              <th>Coût (Ar)</th>
            </tr>
          </thead>
          <tbody>
            {produit.actions && produit.actions.length > 0 ? (
              produit.actions.map((a, index) => (
            
                <tr key={a.id}>
                  <td>{a.nom}</td>
                  <td>{a.employe?.nom ?? "—"}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={a.minutesParAction}
                      onChange={(e) =>
                        handleChangeAction(index, "minutesParAction", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={a.nombreActions}
                      onChange={(e) =>
                        handleChangeAction(index, "nombreActions", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    {(
                      (a.minutesParAction || 0) *
                      (a.nombreActions || 0) *
                      (a.employe?.coutParMinute || 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Aucune action trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Charges directes */}
        <h5 className="mt-4">Charges directes additionnelles</h5>
        <div className="row g-3">
          {Object.keys(charges).map((key) => (
            <div className="col-md-3" key={key}>
              <label className="form-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="number"
                className="form-control"
                name={key}
                value={charges[key]}
                onChange={handleChangeCharge}
              />
            </div>
          ))}
        </div>

        {/* Boutons */}
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-success me-2" onClick={handleSaveAll}>
            💾 Sauvegarder
          </button>
          <button className="btn btn-primary" onClick={handleCalculer}>
            ⚙️ Calculer coût partiel
          </button>
        </div>

        {/* Résultat */}
        {resultat && (
          <div className="card mt-4 shadow-sm">
            <div className="card-header bg-success text-white">
              Résultat du calcul
            </div>
            <div className="card-body">
              <p>Coût des actions : {resultat.coutActions.toFixed(2)} Ar</p>
              <p>Charges directes : {resultat.coutCharges.toFixed(2)} Ar</p>
              <h5>Total (partiel) : {resultat.coutUnitairePartiel.toFixed(2)} Ar</h5>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

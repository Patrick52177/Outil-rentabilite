import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import {
  getProduitById,
  updateActionEmploye,
  updateActionProduit,
  updateParametresGeneraux,
  getCoutUnitairePartiel,
} from "../../services/produitService";
import { getEmployes } from "../../services/employeService"

export default function CoutUnitaire() {

  const { id } = useParams();
  const [employes, setEmployes] = useState(null);
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
  const fetchData =  async () => {
      try{
        const [prod, emps] = await Promise.all([
          getProduitById(id),
          getEmployes(),
        ]);
        setProduit(prod);
        setEmployes(emps);
      }catch(err){
        console.error("Erreur de chargement :", err)
      }finally{
        setLoading(false)
      }
    };
    fetchData();
  }, [id]);

  //Pour afin de choisir l'employe
  const handleChangeEmploye = async (actionId, employeId) =>{
    try{
      const updated = await updateActionEmploye(actionId, employeId);
      setProduit((prev)=> ({
        ...prev, actions: prev.actions.map((a) => a.id === actionId ? { ...a, 
          employe: updated.employe} : a),
      }));
    }catch(err){
     console.error("erreur lors du changement d'employe :", err) ;
    }
  };

  // ✅ Modifier un champ d'action
/*  const handleChangeAction = (index, field, value) => {
    const updatedActions = [...produit.actions];
    updatedActions[index][field] = Number(value);
    setProduit({ ...produit, actions: updatedActions });
  };*/
//Mise à jour des valeurs action

const handleUpdateValeur = async (actionId, field, value) =>{
  const val = Number(value);
  if(isNaN(val)) return ;
setProduit((prev) => ({
  ...prev, actions: prev.actions.map((a)=> a.id === actionId ? { ...a,[field]: val} : a),
}));
   
try {
  await updateActionProduit(actionId, { [field]: val });
} catch (err){
  console.error("Erreur lors de la mise à jour :", err)
}
}

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
  const calculerCoutPartiel = () => {
    if (!produit) return;

    const coutActions = (produit.actions ?? []).reduce((total, a)=>
    {
      const cout = a.minutesParAction * a.nombreActions * (a.employe?.coutParMinute ?? 0);
      return total + cout;
    }, 0);

    const coutCharges = charges.bordereau + charges.communication + charges.informatique + charges.livretPa;

    setResultat({ coutActions,coutCharges,coutPartiel : coutActions+coutCharges});
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
              <th>Frais Personnels</th>
              <th>Coût Employé</th>
              <th>Minutes / transaction</th>
              <th>Nombre p.a</th>
              <th>Coût (Ar)</th>
            </tr>
          </thead>
          <tbody>
            {produit.actions && produit.actions.length > 0 ? (
              produit.actions.map((a, index) => (
            
                <tr key={a.id}>
                  <td>{a.nom}</td>
                  <td style={{minWidth:"200px"}} ><select className="form-select" value={a.employe?.id || ""} 
                  onChange={(e)=> handleChangeEmploye(a.id,parseInt(e.target.value))}>
                    <option value="">--Choisir employé--</option>
                    {employes.map((emp)=>(<option key={emp.id} value={emp.id}>{emp.nom}</option>))}</select></td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={a.minutesParAction || ""}
                      onChange={(e) =>
                        handleUpdateValeur(a.id, "minutesParAction", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={a.nombreActions || ""}
                      onChange={(e) =>
                        handleUpdateValeur(a.id, "nombreActions", e.target.value)
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
                value={charges[key] || ""}
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
          <button className="btn btn-primary" onClick={calculerCoutPartiel}>
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
              <p>Coût des actions : {resultat.coutActions} Ar</p>
              <p>Charges directes : {resultat.coutCharges} Ar</p>
              <h5>Total (partiel) : {resultat.coutPartiel} Ar</h5>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

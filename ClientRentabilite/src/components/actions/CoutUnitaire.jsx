import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduitById } from "../../services/produitService";
import Layout from "../layout/Layout";   // ✅ chemin corrigé
import { getEmployes } from "../../services/employeService";

export default function CoutUnitaire() {
 const { id } = useParams();
 const [produit, setProduit] = useState(null);
 const [ employes, setEmployes] = useState([]);
 const [ChargesDirectes, setChargesDirectes] = useState({
   livretPA: 0,
   bordereau: 0,
   informatique: 0,
   communication: 0,
 });
 const [resultat, setResultat]= useState(null);

 useEffect(()=>{
  getProduitById(id).then(setProduit).catch(console.error);

   getEmployes().then(setEmployes).catch(console.error);
 }, [id]);

 const handleEmployeChange = (actionId, employeId) =>{
  setProduit((prev) => {
    const updated = { ...prev};
    updated.actions = updated.actions.map((a) =>
    a.if === actionId ? {...a, employe: employes.find((e) => e.id === Number(employeId))} : a);
    return updated;
  });
 };
 const handleChangeCharges = (e) => {
  setChargesDirectes({...ChargesDirectes, [e.target.name]: Number(e.target.value)
  });
 };

 const calculerCoutPartiel = () => {
  if (!produit) return;
  
  //coût total des actions 
  const coutActions = produit.actions.reduce((total, a) =>
  {
    const cout = a.minutesParAction || 0 * a.nombresAction || 0  * (a.employe?.coutParMinutes??0);
    return total + cout;
  }, 0);

  const coutCharges = ChargesDirectes.livretPA + ChargesDirectes.bordereau + ChargesDirectes.informatique + ChargesDirectes.communication
 
 const coutPartiel = coutActions + coutCharges;

 setResultat({
  coutActions,
  coutCharges,
  coutPartiel,
 });
};
 if(!produit) return
 <Layout>Chargement</Layout>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Actions Produit</h2>
        {/* Bouton vers la modification des coûts employés */}
        <Link to="/employes" className="btn btn-outline-secondary">
          <i className="bi bi-person-gear me-2"></i>
          Modifier coûts personnels
        </Link>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Nom Action</th>
            <th>Employé assigné</th>
            <th>Nombre d’actions</th>
            <th>Minutes / action</th>
            
            <th></th>
          </tr>
        </thead>
        <tbody>
          {produit.actions && produit.actions.length > 0 ? (
              produit.actions.map((a)=>
            {
              const cout = (a.minutesParAction || 0) * (a.nombresAction || 0) * (a.employe?.coutParMinutes || 0);

              return (
                <tr key={a.id}>
                  <td>{a.typeAction?.nom}</td>
                  <td>
                    <select className="form-select" value={a.employe?.id || ""}
                     onChange={(e) => handleEmployeChange(a.id.target.value)}>
                      <option value="">-- Choisir employé--</option>
                      {employes.map((emp)=> (
                         <option key={emp.id} value={emp.id}>
                        {emp.nom} ( {emp.coutParMinute} Ar/min)
                      </option>
                      ))} 
                     </select>
                  </td>
                  <td>{a.minutesParAction}</td>
                  <td>{cout.toFixed(2)} Ar</td>
                </tr>
              );
            })

            ):(
              <tr>
                <td colSpan="5" className="text-center text-muted">aucune action trouvé</td>
              </tr>
            )
          
          
          }
          </tbody>
      </table>
          <h5>Charges directes </h5>
          <div className="row g-3">
            {Object.keys(ChargesDirectes).map((key)=>(
              <div className="col-md-3" key={key}>
                <label className="form-label">{key.charAt(0).toUpperCase()+key.slice(1)}</label>
                <input type="number" name={key} className="form-control" value={ChargesDirectes[key]}
                onChange={handleChangeCharges}/>
              </div>
            ))}
          </div>
          <button className="btn btn-primary mt-3" onClick={calculerCoutPartiel}> 
            calculer
          </button>
        
      { resultat && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-success text-white">
            Coût unitaire partiel 
          </div>
          <div className="card-body">
            <h5>
              Coût unitaire partiel<strong>{resultat.coutPartiel.toFixed(2)}</strong>
            </h5>
          </div>
        </div>
      )}
    </>
  );
}

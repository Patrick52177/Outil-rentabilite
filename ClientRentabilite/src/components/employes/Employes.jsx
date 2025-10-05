import Layout from "../layout/Layout";
import { useEffect, useState } from "react";
import { getEmployes, updateEmploye } from "../../services/employeService";
import { navigate, useNavigate } from "react-router-dom";
//fonction transformer une clé en label lisible 
const formatKey = (key) => {
  const formattedKey = key.replace(/([A-Z])/g, "$1");
  return formattedKey.replace(/^./,(str) => str.toUpperCase()).replace("IndemniteBase","Indemnite Base").replace("ComplementSalaire","Complément Salaire ").replace("Responsabilite","Responsabilité")
  .replace("Technicite","Technicité").replace("FraisMedicaux","Frais Médicaux").replace("Csr","CSR")
  .replace("Osie","OSIE").replace("AideScolaire","Aide scolaire").replace("VoitureAmortissement","Voiture - Amortissement")
  .replace("Telephone","Téléphone").replace("HeuresDisponiblesParAn","Heure de travail par an").replace("SocialEntretien","Entretien");
}

export default function Employes() {
    const navigate = useNavigate();
  const [employes, setEmployes] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  useEffect(()=> {
    getEmployes().then(setEmployes);
  },[]);
  const handleSave = async () => {
    await updateEmploye(selectedEmploye.id,selectedEmploye);
    alert("Coût personnel mise à jour!");
    const updated = await getEmployes();
    setEmployes(updated);
    setSelectedEmploye(null);
  };
  useEffect(()=> {
    console.log("selectedEmploye mise à jour :", selectedEmploye);
  }, [selectedEmploye]);


  
  return (
    <>
       <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Coût personnels</h2>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
         onClick={()=>navigate(`/coût-unitaire`)}
        >
          ← Retour à la liste
        </button>
      </div>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th> </th>
            <th>Coût/An</th>
            <th>Coût/heure</th>
            <th>Coût/min.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employes.map((emp)=>( 
            <tr key={emp.id}>
              <td>{emp.nom}</td>
              <td>{emp.coutAnnuelTotal?.toFixed(2)} Ar</td>
              <td>{emp.coutParHeure?.toFixed(2)} Ar</td>
              <td>{emp.coutParMinute?.toFixed(2)} Ar</td>
              <td>
                <button className="btn btn-primary btn-sm"
                     onClick={()=>setSelectedEmploye(emp)}>Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedEmploye && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h2 className="modal-title">{selectedEmploye.nom}</h2>
                <button type="button" className="btn-close" onClick={()=>setSelectedEmploye(null)}></button>
              </div>
              <div className="modal-body">
                <h3>Indemnités</h3>
                <div className="row g-3">
                  {Object.keys(selectedEmploye).map((key) =>{
                    const k = key.toLowerCase();

                    const ignoreFields = ["id", "nom", "coutparminute","coutannueltotal","minutesdisponiblesparan",
                      "ticketsppn", "aidescolaire","voitureamortissement","carburant","assurance","fraismedicaux",
                      "csr", "cnaps", "telephone", "autre", "gratification" , "heuresdisponiblesparan", "osie","socialentretien"
                    ];

                    

                    if(
                      ignoreFields.includes(k)
                    )
                    return null;
                  
                    return (
                      <div className="col-md-6" key={key}>
                        <label className="form-label">
                           {formatKey(key)}
                        </label>
                        <input type="number" className="form-control"
                        value={selectedEmploye[key] || ""} onChange={(e)=>
                           setSelectedEmploye({...selectedEmploye,
                                   [key]:e.target.value,
                          })
                        }/>
                      </div>
                    );
                  })}
                  </div>
                    <h3>Charges Patronales</h3>
                <div className="row g-3">
                  {Object.keys(selectedEmploye).map((key) =>{
                    const k = key.toLowerCase();

                    const ignoreFields = ["id", "nom", "coutparminute","coutannueltotal","minutesdisponiblesparan",
                      "indemnitebase", "complementsalaire", "assiduite","responsabilite", "fonction", "restauration",
                      "entretien", "wu", "logement", "technicite", "transport", "caisse", "representation",
                       "telephone", "autre", "gratification" , "heuresdisponiblesparan", "ticketsppn", "aidescolaire","voitureamortissement","carburant","assurance","socialentretien"
                
                    ];

                    

                    if(
                      ignoreFields.includes(k)
                    )
                    return null;
                  
                    return (
                      <div className="col-md-6" key={key}>
                        <label className="form-label">
                           {formatKey(key)}
                        </label>
                        <input type="number" className="form-control"
                        value={selectedEmploye[key] || ""} onChange={(e)=>
                           setSelectedEmploye({...selectedEmploye,
                                   [key]:e.target.value,
                          })
                        }/>
                      </div>
                    );
                  })}
                  </div>
                      <h3>Oeuvres Sociales</h3>
                <div className="row g-3">
                  {Object.keys(selectedEmploye).map((key) =>{
                    const k = key.toLowerCase();

                    const ignoreFields = ["id", "nom", "coutparminute","coutannueltotal","minutesdisponiblesparan",
                      "indemnitebase", "complementsalaire", "assiduite","responsabilite", "fonction", "restauration",
                      "entretien", "wu", "logement", "technicite", "transport", "caisse", "representation","fraismedicaux",
                      "csr", "cnaps", "telephone", "autre", "gratification" , "heuresdisponiblesparan", "osie"
      
                    ];

                    

                    if(
                      ignoreFields.includes(k)
                    )
                    return null;
                  
                    return (
                      <div className="col-md-6" key={key}>
                        <label className="form-label">
                           {formatKey(key)}
                        </label>
                        <input type="number" className="form-control"
                        value={selectedEmploye[key] || ""} onChange={(e)=>
                           setSelectedEmploye({...selectedEmploye,
                                   [key]:e.target.value,
                          })
                        }/>
                      </div>
                    );
                  })}
                  </div>
                         <h3>Autres infos</h3>
                <div className="row g-3">
                  {Object.keys(selectedEmploye).map((key) =>{
                    const k = key.toLowerCase();

                    const ignoreFields = ["id", "nom", "coutparminute","coutannueltotal","minutesdisponiblesparan",
                      "indemnitebase", "complementsalaire", "assiduite","responsabilite", "fonction", "restauration",
                      "entretien", "wu", "logement", "technicite", "transport", "caisse", "representation","fraismedicaux",
                      "csr", "cnaps",   "ticketsppn", "aidescolaire","voitureamortissement","carburant","assurance"
                     , "osie","socialentretien"
                    ];

                    

                    if(
                      ignoreFields.includes(k)
                    )
                    return null;
                  
                    return (
                      <div className="col-md-6" key={key}>
                        <label className="form-label">
                           {formatKey(key)}
                        </label>
                        <input type="number" className="form-control"
                        value={selectedEmploye[key] || ""} onChange={(e)=>
                           setSelectedEmploye({...selectedEmploye,
                                   [key]:e.target.value,
                          })
                        }/>
                      </div>
                    );
                  })}
                  </div>
                
                  <div className="col-12">
                    <label className="form-label fw-bold text-success">Coût par min.</label>
                    <input type="text" className="form-control bg-light" value={`${selectedEmploye.coutParMinute?.toFixed(2)} Ar`} />
                  </div>
                    <div className="col-12">
                    <label className="form-label fw-bold text-success">Coût par an</label>
                    <input type="text" className="form-control bg-light" value={`${selectedEmploye.coutAnnuelTotal?.toFixed(2)} Ar`} readOnly/>
                  </div>
                   
                
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setSelectedEmploye(null)}>Annuler</button>
                <button className="btn btn-success" onClick={handleSave}>Sauver</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

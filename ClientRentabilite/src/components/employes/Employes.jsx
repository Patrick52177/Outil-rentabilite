import Layout from "../layout/Layout";
import { useEffect, useState } from "react";
import { getEmployes, updateEmploye } from "../../services/employeService";

//fonction transformer une clé en label lisible 
const formatKey = (key) => {
  const formattedKey = key.replace(/([A-Z])/g, "$1");
  return formattedKey.replace(/^./,(str) => str.toUpperCase()).replace("IndemniteBase","Indemnite Base");
}

export default function Employes() {
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

  return (
    <>
      <h2>Coût personnel</h2>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th> </th>
            <th>Coût/min</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employes.map((emp)=>( 
            <tr key={emp.id}>
              <td>{emp.nom}</td>
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
                <h5 className="modal-title">{selectedEmploye.nom}</h5>
                <button type="button" className="btn-close" onClick={()=>setSelectedEmploye(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {Object.keys(selectedEmploye).map((key) =>{
                    const k = key.toLowerCase();

                    const ignoreFields = ["id", "nom", "coutparminute","coutannueltotal","minutesdisponiblesparan"];

                    

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
                        value={selectedEmploye[key]} onChange={(e)=>
                           setSelectedEmploye({...selectedEmploye,
                                   [key]:e.target.value.replace(/^0+/,""),
                          })
                        }/>
                      </div>
                    );
                  })}
                  <div className="col-12">
                    <label className="form-label fw-bold text-success">Coût par min.</label>
                    <input type="text" className="form-control bg-light" value={`${selectedEmploye.coutParMinute?.toFixed(2)} Ar`} readOnly/>
                  </div>
                    <div className="col-12">
                    <label className="form-label fw-bold text-success">Coût par an</label>
                    <input type="text" className="form-control bg-light" value={`${selectedEmploye.coutAnnuelTotal?.toFixed(2)} Ar`} readOnly/>
                  </div>
                   
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

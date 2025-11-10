import { useState } from "react";
import Layout from "../layout/Layout";

export default function Marge() {
  const [tauxActuel, setTauxActuel] = useState(0);
  const [coutUnitairePartiel, setCoutUnitairePartiel] = useState(0);
  const [moyenneGlissante, setMoyenneGlissante] = useState([
    { nom: "BTA 4", valeur: 3.5 },
    { nom: "BTA 12", valeur: 4.1 },
    { nom: "BTA 24", valeur: 4.5 },
    { nom: "BTA 52", valeur: 5.0 },
  ]);
  const [parts, setParts] = useState(moyenneGlissante.map(() => 0));
  const [resultat, setResultat] = useState(null);

  const handleChangePart = (index, value) => {
    const newParts = [...parts];
    newParts[index] = Number(value);
    setParts(newParts);
  };

  const calculerMarge = () => {
    const marcheTotal = moyenneGlissante.reduce(
      (sum, m, i) => sum + (m.valeur * (parts[i] || 0)),
      0
    );
    const marge = marcheTotal - tauxActuel;
    const seuilPartiel =
      marge !== 0 ? Math.round((coutUnitairePartiel / (marge * 100)) * 1000) / 1000 : 0;

    setResultat({ marcheTotal, marge, seuilPartiel });
  };

  return (
    <>
      <h2>Calcul de la Marge</h2>
      <div className="card p-3 shadow-sm">
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Taux Actuel (%)</label>
            <input
              type="number"
              className="form-control"
              value={tauxActuel}
              onChange={(e) => setTauxActuel(Number(e.target.value))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Coût unitaire partiel (Ar)</label>
            <input
              type="number"
              className="form-control"
              value={coutUnitairePartiel}
              onChange={(e) => setCoutUnitairePartiel(Number(e.target.value))}
            />
          </div>
        </div>

        <h5>Moyenne glissante et parts (%)</h5>
        <table className="table table-bordered mt-2">
          <thead className="table-dark">
            <tr>
              <th>Marché</th>
              <th>Moyenne glissante (%)</th>
              <th>Part (%)</th>
            </tr>
          </thead>
          <tbody>
            {moyenneGlissante.map((m, i) => (
              <tr key={i}>
                <td>{m.nom}</td>
                <td>{m.valeur}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={parts[i]}
                    onChange={(e) => handleChangePart(i, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-success mt-3" onClick={calculerMarge}>
          Calculer la marge
        </button>

        {resultat && (
          <div className="alert alert-info mt-4">
            <p><strong>Marché total :</strong> {resultat.marcheTotal.toFixed(2)} %</p>
            <p><strong>Marge :</strong> {resultat.marge.toFixed(2)} %</p>
            <p><strong>Seuil de rentabilité partiel :</strong> {resultat.seuilPartiel.toFixed(3)} %</p>
          </div>
        )}
      </div>
    </>
  );
}

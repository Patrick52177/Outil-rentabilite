import React, { useState, useEffect } from "react";
import {
  createTauxMarche,
  getTauxMarcheCalculs,
  getTauxMarches,
} from "../../services/tauxMarcheService";
import "./tauxMarchePage.css"; // <--- CSS personnalisé

export default function TauxMarchePage() {
  const [taux, setTaux] = useState({
    tauxPlacementJourLeJour: 0,
    bta30: 0,
    bta90: 0,
    bta180: 0,
    bta360: 0,
    tauxIRCM: 0,
    reserveObligatoire: 0,
    tauxInteret: 0,
    refinancement: 0,
    marge: 0,
  });

  const [resultats, setResultats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dernierTauxDate, setDernierTauxDate] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [calculLoading, setCalculLoading] = useState(false);

  // Normaliser les noms venant du backend
  const normaliserTaux = (data) => ({
    tauxPlacementJourLeJour: data.tauxPlacementJourLeJour ?? data.TauxPlacementJourLeJour ?? 0,
    bta30: data.bta30 ?? data.BTA30 ?? 0,
    bta90: data.bta90 ?? data.BTA90 ?? 0,
    bta180: data.bta180 ?? data.BTA180 ?? 0,
    bta360: data.bta360 ?? data.BTA360 ?? 0,
    tauxIRCM: data.tauxIRCM ?? data.TauxIRCM ?? 0,
    reserveObligatoire: data.reserveObligatoire ?? data.ReserveObligatoire ?? 0,
    tauxInteret: data.tauxInteret ?? data.TauxInteret ?? 0,
    refinancement: data.refinancement ?? data.Refinancement ?? 0,
    marge: data.marge ?? data.Marge ?? 0,
  });

  const fetchDernierTaux = async () => {
    try {
      setLoading(true);
      const liste = await getTauxMarches();
      if (liste && liste.length > 0) {
        const dernier = liste[0];
        setTaux(normaliserTaux(dernier));
        setDernierTauxDate(new Date(dernier.dateEnregistrement ?? dernier.DateEnregistrement));
        const calculs = await getTauxMarcheCalculs(dernier.id ?? dernier.Id);
        setResultats(calculs);
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le dernier taux.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDernierTaux();
  }, []);

  // Calcul instantané
  useEffect(() => {
    const calculer = () => {
      const hasData = taux.tauxPlacementJourLeJour > 0 || 
                      taux.bta30 > 0 || 
                      taux.bta90 > 0 || 
                      taux.bta180 > 0 || 
                      taux.bta360 > 0;
      if (!hasData) {
        setResultats(null);
        return;
      }

      setCalculLoading(true);
      try {
        const emprunt = {
          jour: taux.tauxPlacementJourLeJour + taux.marge,
          j30: taux.bta30 + taux.marge,
          j90: taux.bta90 + taux.marge,
          j180: taux.bta180 + taux.marge,
          j360: taux.bta360 + taux.marge,
        };

        const calc = (e, t) => (e - t) * taux.reserveObligatoire;

        setResultats({
          emprunts: emprunt,
          resultats: {
            jour: calc(emprunt.jour, taux.tauxPlacementJourLeJour),
            j30: calc(emprunt.j30, taux.bta30),
            j90: calc(emprunt.j90, taux.bta90),
            j180: calc(emprunt.j180, taux.bta180),
            j360: calc(emprunt.j360, taux.bta360),
          }
        });
      } catch(err) {
        console.error(err);
      } finally {
        setCalculLoading(false);
      }
    };
    calculer();
  }, [taux]);

  const handleEnregistrer = async () => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const response = await createTauxMarche(taux);
      if (!response.id) throw new Error("ID manquant");
      const calculs = await getTauxMarcheCalculs(response.id);
      setResultats(calculs);
      setDernierTauxDate(new Date());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch(err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTaux({
      tauxPlacementJourLeJour: 0,
      bta30: 0,
      bta90: 0,
      bta180: 0,
      bta360: 0,
      tauxIRCM: 0,
      reserveObligatoire: 0,
      tauxInteret: 0,
      refinancement: 0,
      marge: 0,
    });
    setResultats(null);
    setError(null);
    setSaveSuccess(false);
  };

  const getEmprunt = (key) => {
    if (!resultats) return "-";
    switch(key){
      case "tauxPlacementJourLeJour": return resultats.emprunts?.jour?.toFixed(4)||"-";
      case "bta30": return resultats.emprunts?.j30?.toFixed(4)||"-";
      case "bta90": return resultats.emprunts?.j90?.toFixed(4)||"-";
      case "bta180": return resultats.emprunts?.j180?.toFixed(4)||"-";
      case "bta360": return resultats.emprunts?.j360?.toFixed(4)||"-";
      default: return "-";
    }
  };

  const getResultat = (key) => {
    if (!resultats) return "-";
    switch(key){
      case "tauxPlacementJourLeJour": return resultats.resultats?.jour?.toFixed(6)||"-";
      case "bta30": return resultats.resultats?.j30?.toFixed(6)||"-";
      case "bta90": return resultats.resultats?.j90?.toFixed(6)||"-";
      case "bta180": return resultats.resultats?.j180?.toFixed(6)||"-";
      case "bta360": return resultats.resultats?.j360?.toFixed(6)||"-";
      default: return "-";
    }
  };

  const fields = [
    { key: "tauxPlacementJourLeJour", label: "Taux placement jour le jour" },
    { key: "bta30", label: "Taux placement BTA 30 jours" },
    { key: "bta90", label: "Taux placement BTA 90 jours" },
    { key: "bta180", label: "Taux placement BTA 180 jours" },
    { key: "bta360", label: "Taux placement BTA 360 jours" },
    { key: "tauxIRCM", label: "Taux IRCM" },
    { key: "reserveObligatoire", label: "Réserve obligatoire" },
    { key: "tauxInteret", label: "Taux d'intérêt" },
    { key: "refinancement", label: "Refinancement" },
    { key: "marge", label: "Marge" },
  ];

  const formatDate = (date) => date ? date.toLocaleString("fr-FR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "";

  return (
    <div className="taux-container">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <h1 className="h4 mb-2 mb-md-0">💰 Gestion et calcul des taux du marché</h1>
        <div className="btn-group">
          <button onClick={fetchDernierTaux} className="btn btn-primary" disabled={loading}>🔄 Actualiser</button>
          <button onClick={handleReset} className="btn btn-outline-secondary" disabled={loading}>↺ Réinitialiser</button>
          <button onClick={handleEnregistrer} className="btn btn-success" disabled={loading}>{loading ? "⏳ Enregistrement..." : "💾 Enregistrer"}</button>
        </div>
      </div>

      {dernierTauxDate && <div className="text-center text-muted mb-3">🕒 Dernière mise à jour : <strong className="text-primary">{formatDate(dernierTauxDate)}</strong></div>}
      {saveSuccess && <div className="alert alert-success">✅ Les taux ont été enregistrés avec succès !</div>}
      {error && <div className="alert alert-danger">⚠️ {error}</div>}

      <div className="taux-card">
        <div className="row fw-bold taux-header mb-2">
          <div className="col-6">📌 Taux</div>
          <div className="col-3 text-center">💵 Emprunt (%)</div>
          <div className="col-3 text-center">📈 Résultat</div>
        </div>

        {fields.map(({ key, label }) => (
          <div key={key} className="row taux-row border-bottom">
            <div className="col-6">
              <label>{label}</label>
              <input
                type="number"
                step="0.0001"
                value={taux[key]}
                onChange={(e) => setTaux({ ...taux, [key]: parseFloat(e.target.value) || 0 })}
                className="form-control form-control-sm"
              />
            </div>

            <div className="col-3 text-center">
              {["tauxPlacementJourLeJour","bta30","bta90","bta180","bta360"].includes(key) ?
                <span className="badge-custom bg-emprunt">{calculLoading ? "..." : getEmprunt(key)}</span> : "-"}
            </div>

            <div className="col-3 text-center">
              {["tauxPlacementJourLeJour","bta30","bta90","bta180","bta360"].includes(key) ?
                <span className="badge-custom bg-resultat">{calculLoading ? "..." : getResultat(key)}</span> : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

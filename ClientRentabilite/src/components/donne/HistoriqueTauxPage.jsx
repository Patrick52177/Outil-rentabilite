import React, { useEffect, useState } from "react";
import { getTauxMarches } from "../../services/tauxMarcheService";
import "./tauxMarchePage.css"; // <--- CSS personnalisé
export default function HistoriqueTauxPage() {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chargerHistorique = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTauxMarches();
      setHistorique(data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'historique :", err);
      setError("Impossible de charger l'historique des taux.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerHistorique();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getValue = (item, key) => {
    const value = item[key] ?? item[key.charAt(0).toUpperCase() + key.slice(1)];
    if (value === null || value === undefined || value === "") return 0;
    return value;
  };

  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.0000" : num.toFixed(4);
  };

  // Détermine la couleur du badge selon la valeur et le type
  const getBadgeClass = (value, type) => {
    if (type === "bta") {
      if (value < 2) return "bg-success";
      if (value < 5) return "bg-warning text-dark";
      return "bg-danger";
    }
    switch (type) {
      case "IRCM": return "bg-info";
      case "reserve": return "bg-secondary text-white";
      case "interet": return "bg-warning text-dark";
      case "refinancement": return "bg-warning";
      case "marge": return "bg-danger";
      default: return "bg-success";
    }
  };

  return (
    <div className="container py-4">
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-primary">📜 Historique des Taux du Marché</h1>
        <button
          onClick={chargerHistorique}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "⏳ Chargement..." : "🔄 Actualiser"}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-danger d-flex flex-column" role="alert">
          <strong>⚠️ Erreur</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: "4rem", height: "4rem"}}></div>
          <p className="mt-3 text-muted fw-bold">Chargement de l'historique...</p>
        </div>
      )}

      {/* Tableau */}
      {!loading && (
        <div className="card shadow-lg rounded-3">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead style={{ background: "linear-gradient(90deg, #0d6efd, #0b5ed7)", color: "white" }}>
                <tr>
                  <th title="Date et heure de l'enregistrement">📅 Date</th>
                  <th className="text-center" title="Taux de placement Jour le jour">Jour le jour</th>
                  <th className="text-center" title="Bon du Trésor à 30 jours">BTA 30</th>
                  <th className="text-center" title="Bon du Trésor à 90 jours">BTA 90</th>
                  <th className="text-center" title="Bon du Trésor à 180 jours">BTA 180</th>
                  <th className="text-center" title="Bon du Trésor à 360 jours">BTA 360</th>
                  <th className="text-center" title="Taux IRCM">IRCM</th>
                  <th className="text-center" title="Réserve obligatoire">Réserve Oblig.</th>
                  <th className="text-center" title="Taux d'intérêt">Taux Intérêt</th>
                  <th className="text-center" title="Refinancement">Refinancement</th>
                  <th className="text-center" title="Marge">Marge</th>
                </tr>
              </thead>
              <tbody>
                {historique.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <svg className="bi bi-file-text mb-3" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                          <path d="M4 2v12h8V2H4z"/>
                        </svg>
                        <strong>Aucun enregistrement trouvé</strong>
                        <small>Commencez par saisir des taux sur la page principale</small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  historique.map((taux, index) => (
                    <tr key={taux.id || taux.Id || index}>
                      <td>{formatDate(getValue(taux, 'dateEnregistrement'))}</td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'tauxPlacementJourLeJour'), 'bta')}`}>
                          {formatNumber(getValue(taux, 'tauxPlacementJourLeJour'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'bta30'), 'bta')}`}>
                          {formatNumber(getValue(taux, 'bta30'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'bta90'), 'bta')}`}>
                          {formatNumber(getValue(taux, 'bta90'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'bta180'), 'bta')}`}>
                          {formatNumber(getValue(taux, 'bta180'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'bta360'), 'bta')}`}>
                          {formatNumber(getValue(taux, 'bta360'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'tauxIRCM'), 'IRCM')}`}>
                          {formatNumber(getValue(taux, 'tauxIRCM'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'reserveObligatoire'), 'reserve')}`}>
                          {formatNumber(getValue(taux, 'reserveObligatoire'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'tauxInteret'), 'interet')}`}>
                          {formatNumber(getValue(taux, 'tauxInteret'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'refinancement'), 'refinancement')}`}>
                          {formatNumber(getValue(taux, 'refinancement'))}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getBadgeClass(getValue(taux, 'marge'), 'marge')}`}>
                          {formatNumber(getValue(taux, 'marge'))}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {historique.length > 0 && (
            <div className="card-footer text-muted">
              <strong>{historique.length}</strong> enregistrement(s) trouvé(s)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

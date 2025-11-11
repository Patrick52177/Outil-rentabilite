import React, { useState, useEffect } from "react";
import {
  createTauxMarche,
  getTauxMarcheCalculs,
} from "../../services/tauxMarcheService";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaux((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // 🔹 Calcul automatique à chaque changement de taux
  useEffect(() => {
    const calculer = async () => {
      setLoading(true);
      setError(null);
      try {
        // Créer ou mettre à jour le taux sur le backend
        const response = await createTauxMarche(taux);
        const id = response.id;
        if (!id) throw new Error("ID non retourné par le serveur");

        // Récupérer les calculs
        const calculs = await getTauxMarcheCalculs(id);
        setResultats(calculs);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du calcul automatique");
      } finally {
        setLoading(false);
      }
    };

    calculer();
  }, [taux]);

  const getEmprunt = (key) => {
    if (!resultats) return "-";
    switch (key) {
      case "tauxPlacementJourLeJour": return resultats.emprunts?.jour?.toFixed(4) || "-";
      case "bta30": return resultats.emprunts?.j30?.toFixed(4) || "-";
      case "bta90": return resultats.emprunts?.j90?.toFixed(4) || "-";
      case "bta180": return resultats.emprunts?.j180?.toFixed(4) || "-";
      case "bta360": return resultats.emprunts?.j360?.toFixed(4) || "-";
      default: return "-";
    }
  };

  const getResultat = (key) => {
    if (!resultats) return "-";
    switch (key) {
      case "tauxPlacementJourLeJour": return resultats.resultats?.jour?.toFixed(6) || "-";
      case "bta30": return resultats.resultats?.j30?.toFixed(6) || "-";
      case "bta90": return resultats.resultats?.j90?.toFixed(6) || "-";
      case "bta180": return resultats.resultats?.j180?.toFixed(6) || "-";
      case "bta360": return resultats.resultats?.j360?.toFixed(6) || "-";
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        💰 Gestion et calcul des taux du marché
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-md">
        {/* En-tête */}
        <div className="flex items-center font-semibold text-gray-700 border-b border-gray-300 pb-2">
          <div className="w-1/2 min-w-[220px]">📥 Saisie</div>
          <div className="w-1/4 min-w-[100px] text-center">💵 Emprunt (%)</div>
          <div className="w-1/4 min-w-[100px] text-center">📈 Résultat</div>
        </div>

        {/* Lignes */}
        {fields.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center space-x-4 py-2 border-b border-gray-200"
          >
            {/* Input */}
            <div className="w-1/2 min-w-[220px]">
              <label className="block font-medium">{label}</label>
              <input
                type="number"
                step="0.0001"
                name={key}
                value={taux[key]  || ""}
                onChange={handleChange}
                className="border rounded p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Taux emprunt */}
            <div className="w-1/4 min-w-[100px] text-center">
              {["tauxPlacementJourLeJour", "bta30", "bta90", "bta180", "bta360"].includes(key) ? (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold shadow">
                  {loading ? "..." : getEmprunt(key)}
                </span>
              ) : (
                <span>-</span>
              )}
            </div>

            {/* Résultat calculé */}
            <div className="w-1/4 min-w-[100px] text-center">
              {["tauxPlacementJourLeJour", "bta30", "bta90", "bta180", "bta360"].includes(key) ? (
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold shadow">
                  {loading ? "..." : getResultat(key)}
                </span>
              ) : (
                <span>-</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  createTauxMarche,
  getTauxMarcheCalculs,
  getTauxMarches,
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
  const [dernierTauxDate, setDernierTauxDate] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [calculLoading, setCalculLoading] = useState(false);

  // ✅ Fonction utilitaire pour normaliser les noms venant du backend
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

  // ✅ Charger le dernier taux
  const fetchDernierTaux = async () => {
    try {
      setLoading(true);
      const liste = await getTauxMarches();
      if (liste && liste.length > 0) {
        const dernier = liste[0];
        setTaux(normaliserTaux(dernier));
        setDernierTauxDate(new Date(dernier.dateEnregistrement ?? dernier.DateEnregistrement));

        // Charger les résultats du dernier taux
        const calculs = await getTauxMarcheCalculs(dernier.id ?? dernier.Id);
        setResultats(calculs);
      }
    } catch (err) {
      console.error("Erreur lors du chargement du dernier taux :", err);
      setError("Impossible de charger le dernier taux enregistré.");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Appel initial au chargement
  useEffect(() => {
    fetchDernierTaux();
  }, []);

  // 🔹 Calcul en temps réel sans enregistrement
  useEffect(() => {
    const calculerEnTempsReel = async () => {
      // Vérifier si au moins un champ BTA est rempli
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
        // Calcul local sans enregistrement
        const empruntJour = taux.tauxPlacementJourLeJour + taux.marge;
        const emprunt30 = taux.bta30 + taux.marge;
        const emprunt90 = taux.bta90 + taux.marge;
        const emprunt180 = taux.bta180 + taux.marge;
        const emprunt360 = taux.bta360 + taux.marge;

        const calc = (emprunt, tauxPlacement) => 
          (emprunt - tauxPlacement) * taux.reserveObligatoire;

        setResultats({
          emprunts: {
            jour: empruntJour,
            j30: emprunt30,
            j90: emprunt90,
            j180: emprunt180,
            j360: emprunt360
          },
          resultats: {
            jour: calc(empruntJour, taux.tauxPlacementJourLeJour),
            j30: calc(emprunt30, taux.bta30),
            j90: calc(emprunt90, taux.bta90),
            j180: calc(emprunt180, taux.bta180),
            j360: calc(emprunt360, taux.bta360)
          }
        });
      } catch (err) {
        console.error("Erreur calcul:", err);
      } finally {
        setCalculLoading(false);
      }
    };

    calculerEnTempsReel();
  }, [taux]);

  // 🔹 Enregistrer dans la base de données
  const handleEnregistrer = async () => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const response = await createTauxMarche(taux);
      const id = response.id;
      
      if (!id) {
        throw new Error("ID non retourné par le serveur");
      }

      // Récupérer les calculs depuis le backend
      const calculs = await getTauxMarcheCalculs(id);
      setResultats(calculs);
      setDernierTauxDate(new Date());
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (err) {
      console.error("Erreur :", err);
      setError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Réinitialiser le formulaire
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

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-center">
          💰 Gestion et calcul des taux du marché
        </h1>

        {/* 🔄 Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={fetchDernierTaux}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow font-semibold transition"
            disabled={loading}
          >
            🔄 Actualiser
          </button>
          
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow font-semibold transition"
            disabled={loading}
          >
            ↺ Réinitialiser
          </button>
          
          <button
            onClick={handleEnregistrer}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow font-semibold transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "⏳ Enregistrement..." : "💾 Enregistrer"}
          </button>
        </div>
      </div>

      {dernierTauxDate && (
        <div className="text-sm text-center text-gray-600 mb-4">
          🕒 Dernière mise à jour :{" "}
          <span className="font-semibold text-blue-700">
            {formatDate(dernierTauxDate)}
          </span>
        </div>
      )}

      {/* Message de succès */}
      {saveSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 shadow">
          <p className="font-bold">✅ Succès</p>
          <p>Les taux ont été enregistrés avec succès dans l'historique !</p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 shadow">
          <p className="font-bold">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-md">
        <div className="flex items-center font-semibold text-gray-700 border-b border-gray-300 pb-2">
          <div className="w-1/2"></div>
          <div className="w-1/4 text-center">💵 Emprunt (%)</div>
          <div className="w-1/4 text-center">📈 Résultat</div>
        </div>

        {fields.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center space-x-4 py-2 border-b border-gray-200"
          >
            <div className="w-1/2 min-w-[220px]">
              <label className="block font-medium">{label}</label>
              <input
                type="number"
                step="0.0001"
                name={key}
                value={taux[key] || ""}
                onChange={(e) =>
                  setTaux({ ...taux, [key]: parseFloat(e.target.value) || 0 })
                }
                className="border rounded p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="w-1/4 text-center">
              {["tauxPlacementJourLeJour", "bta30", "bta90", "bta180", "bta360"].includes(
                key
              ) ? (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold shadow">
                  {calculLoading ? "..." : getEmprunt(key)}
                </span>
              ) : (
                <span>-</span>
              )}
            </div>

            <div className="w-1/4 text-center">
              {["tauxPlacementJourLeJour", "bta30", "bta90", "bta180", "bta360"].includes(
                key
              ) ? (
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold shadow">
                  {calculLoading ? "..." : getResultat(key)}
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
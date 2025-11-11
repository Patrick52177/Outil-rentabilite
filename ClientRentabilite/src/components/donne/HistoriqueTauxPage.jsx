import React, { useEffect, useState } from "react";
import { getTauxMarches } from "../../services/tauxMarcheService";

export default function HistoriqueTauxPage() {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger l'historique au montage du composant
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

  // Fonction pour normaliser les valeurs (camelCase ou PascalCase)
  const getValue = (item, key) => {
    const value = item[key] ?? item[key.charAt(0).toUpperCase() + key.slice(1)];
    // Retourner 0 si la valeur est null, undefined, ou NaN
    if (value === null || value === undefined || value === "") return 0;
    return value;
  };
  
  // Fonction pour formater les valeurs numériques
  const formatNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.0000" : num.toFixed(4);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête avec bouton actualiser */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          📜 Historique des Taux du Marché
        </h1>
        <button
          onClick={chargerHistorique}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md font-semibold transition disabled:bg-gray-400"
        >
          {loading ? "⏳ Chargement..." : "🔄 Actualiser"}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 text-red-700 border-l-4 border-red-500 px-4 py-3 rounded mb-6 shadow">
          <p className="font-bold">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Chargement de l'historique...</p>
        </div>
      )}

      {/* Tableau d'historique */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold border-r border-blue-500">
                    📅 Date
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    Jour le jour
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    BTA 30
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    BTA 90
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    BTA 180
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    BTA 360
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    IRCM
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    Réserve Oblig.
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    Taux Intérêt
                  </th>
                  <th className="px-4 py-3 text-center font-semibold border-r border-blue-500">
                    Refinancement
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Marge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historique.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-semibold">Aucun enregistrement trouvé</p>
                        <p className="text-sm">Commencez par saisir des taux sur la page principale</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  historique.map((taux, index) => (
                    <tr
                      key={taux.id || taux.Id || index}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-3 border-r font-medium text-gray-700 whitespace-nowrap">
                        {formatDate(getValue(taux, 'dateEnregistrement'))}
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-green-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'tauxPlacementJourLeJour'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-green-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'bTA30'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-green-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'bTA90'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-green-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'bta180'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-green-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'bta360'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-blue-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'tauxIRCM'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-purple-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'reserveObligatoire'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-orange-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'tauxInteret'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r text-center">
                        <span className="inline-block bg-yellow-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'refinancement'))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block bg-red-100 text-black px-2 py-1 rounded font-semibold">
                          {formatNumber(getValue(taux, 'marge'))}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer avec nombre d'enregistrements */}
          {historique.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{historique.length}</span> enregistrement(s) trouvé(s)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
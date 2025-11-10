import React, { useState } from "react";
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

  // 🔹 Gérer le changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaux((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // 🔹 Envoi du formulaire + calcul des résultats
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1️⃣ Enregistrement du taux dans le backend
      const response = await createTauxMarche(taux);
      console.log("Response:", response);
      
      // ✅ Récupérer l'ID depuis la réponse
      const id = response.id;
      
      if (!id) {
        throw new Error("ID non retourné par le serveur");
      }

      // 2️⃣ Calcul automatique côté backend
      const calculs = await getTauxMarcheCalculs(id);
      setResultats(calculs);
      
    } catch (err) {
      console.error("Erreur :", err);
      setError("Une erreur est survenue lors du calcul des taux.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        💰 Gestion et calcul des taux du marché
      </h1>

      {/* ========================= ERREUR ========================= */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ========================= FORMULAIRE ========================= */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl shadow-md"
      >
        <div>
          <label className="block font-semibold">
            Taux placement jour le jour
          </label>
          <input
            type="number"
            step="0.0001"
            name="tauxPlacementJourLeJour"
            value={taux.tauxPlacementJourLeJour}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">BTA 30 jours</label>
          <input
            type="number"
            step="0.0001"
            name="bta30"
            value={taux.bta30}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">BTA 90 jours</label>
          <input
            type="number"
            step="0.0001"
            name="bta90"
            value={taux.bta90}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">BTA 180 jours</label>
          <input
            type="number"
            step="0.0001"
            name="bta180"
            value={taux.bta180}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">BTA 360 jours</label>
          <input
            type="number"
            step="0.0001"
            name="bta360"
            value={taux.bta360}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Taux IRCM</label>
          <input
            type="number"
            step="0.0001"
            name="tauxIRCM"
            value={taux.tauxIRCM}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Réserve obligatoire</label>
          <input
            type="number"
            step="0.0001"
            name="reserveObligatoire"
            value={taux.reserveObligatoire}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Taux d'intérêt</label>
          <input
            type="number"
            step="0.0001"
            name="tauxInteret"
            value={taux.tauxInteret}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Refinancement</label>
          <input
            type="number"
            step="0.0001"
            name="refinancement"
            value={taux.refinancement}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Marge</label>
          <input
            type="number"
            step="0.0001"
            name="marge"
            value={taux.marge}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Calcul en cours..." : "Calculer"}
          </button>
        </div>
      </form>

      {/* ========================= RÉSULTATS ========================= */}
      {resultats && (
        <div className="mt-8">
          {/* Tableau des taux d'emprunt */}
          <h2 className="text-xl font-bold mb-3">📊 Taux d'emprunt</h2>
          <table className="table-auto border w-full mb-6">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Période</th>
                <th className="border p-2">Jour</th>
                <th className="border p-2">30 jours</th>
                <th className="border p-2">90 jours</th>
                <th className="border p-2">180 jours</th>
                <th className="border p-2">360 jours</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border p-2 font-semibold">Taux emprunt (%)</td>
                <td className="border p-2">{resultats.emprunts.jour.toFixed(4)}</td>
                <td className="border p-2">{resultats.emprunts.j30.toFixed(4)}</td>
                <td className="border p-2">{resultats.emprunts.j90.toFixed(4)}</td>
                <td className="border p-2">{resultats.emprunts.j180.toFixed(4)}</td>
                <td className="border p-2">{resultats.emprunts.j360.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>

          {/* Tableau des résultats calculés */}
          <h2 className="text-xl font-bold mb-3">📈 Résultats calculés</h2>
          <table className="table-auto border w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Période</th>
                <th className="border p-2">Jour</th>
                <th className="border p-2">30 jours</th>
                <th className="border p-2">90 jours</th>
                <th className="border p-2">180 jours</th>
                <th className="border p-2">360 jours</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border p-2 font-semibold">Résultat</td>
                <td className="border p-2">{resultats.resultats.jour.toFixed(6)}</td>
                <td className="border p-2">{resultats.resultats.j30.toFixed(6)}</td>
                <td className="border p-2">{resultats.resultats.j90.toFixed(6)}</td>
                <td className="border p-2">{resultats.resultats.j180.toFixed(6)}</td>
                <td className="border p-2">{resultats.resultats.j360.toFixed(6)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
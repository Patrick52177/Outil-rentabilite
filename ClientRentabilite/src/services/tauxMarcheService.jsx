import axios from "axios";

// ✅ URL exacte du backend ASP.NET Core
const API_URL = "http://localhost:5243/api/TauxMarcheApi";

/**
 * 🔹 Récupérer tous les taux du marché
 */
export const getTauxMarches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des taux du marché :", error);
    throw error;
  }
};

/**
 * 🔹 Récupérer un taux spécifique par ID
 */
export const getTauxMarcheById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du chargement du taux ${id} :`, error);
    throw error;
  }
};

/**
 * 🔹 Créer un nouveau taux du marché
 */
export const createTauxMarche = async (taux) => {
  try {
    const response = await axios.post(API_URL, taux);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du taux du marché :", error);
    throw error;
  }
};

/**
 * 🔹 Mettre à jour un taux du marché existant
 */
export const updateTauxMarche = async (id, taux) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, taux);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du taux ${id} :`, error);
    throw error;
  }
};

/**
 * 🔹 Récupérer les calculs d'emprunt et de résultats pour un taux donné
 */
export const getTauxMarcheCalculs = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/calculs`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du calcul des taux pour l'ID ${id} :`, error);
    throw error;
  }
};
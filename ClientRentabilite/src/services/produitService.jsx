import axios from "axios";

// URL exacte de ton backend
const API_URL = "http://localhost:5243/api/ProduitsApi";

// Configuration Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Récupérer tous les produits
export const getProduits = async () => {
  try {
    const response = await axiosInstance.get("");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw error;
  }
};

// Récupérer un produit par id
export const getProduitById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    throw error;
  }
};

// Créer un produit
export const createProduit = async (produit) => {
  try {
    const response = await axiosInstance.post("", produit);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    throw error;
  }
};

// Modifier un produit
export const updateProduit = async (id, produit) => {
  try {
    const response = await axiosInstance.put(`/${id}`, produit);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la modification du produit ${id}:`, error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduit = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id}:`, error);
    throw error;
  }
};

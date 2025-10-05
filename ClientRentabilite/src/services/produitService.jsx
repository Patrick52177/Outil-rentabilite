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


// Créer un produit
export const createProduit = async (produit) => {
  try {
    const response = await axiosInstance.post("", {
      nom: produit.nom,
      typeProduit: produit.typeProduit
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error.response?.data || error.message);
    throw error;
  }
};

// Modifier un produit
export const updateProduit = async (id, produit) => {
  try {
    const response = await axiosInstance.put(`${id}`, produit);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la modification du produit ${id}:`, error);
    throw error;
  }
};

// Supprimer un produit

//Initialiser les actions par défaut pour un produit
export const initActions = async (produitId) => {
  try {
    const response = await axiosInstance.post(`/${produitId}/actions/init`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'initialisation des actions:", error);
    throw error;
  }
};
// Récupérer un produit par id
export const getProduitById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}/details`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    throw error;
  }
};
//Mettre à jour une action
export const updateActionProduit = async (actionId, action) => {
  try{
    const response = await axiosInstance.put(`/actions/${actionId}`, action)
     return response.data;
  }catch (error) {
    console.error(`Erreur lors de la mise à jour de l'action:`, error);
    throw error;
  }
};

//Mettre à jour les paramètres généraux (charges directes)
export const updateParametresGeneraux = async (produitId, parametres) => {
  try {
    const response = await axiosInstance.put(`${produitId}/parametres`, parametres);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres généraux :", error);
    throw error;
  }
};

  //calcul coût partiel 
  export const getCoutUnitairePartiel = async (Id) => {
    try{
     const response = await axiosInstance.get(`${Id}/cout-partiel`);
     return response.data;
    } catch (error) {
    console.error(`Erreur lors de la calcule coût unitaire du produit :`, error);
    throw error;
    
  }
};

export const deleteProduit = async (id) => {
  try {
   const response = await axiosInstance.delete(`${id}`);
   return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id}:`, error);
    throw error;
  }
};

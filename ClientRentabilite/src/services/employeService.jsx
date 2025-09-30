import axios from "axios";

// URL exacte de ton backend
const API_URL = "http://localhost:5243/api/EmployeApi";
//Récupérer tous les employés 
export const getEmployes = async () =>
{
    try{
       const response = await axios.get(API_URL);
    return response.data;
    }catch(error){
        console.error("Erreur lors du chargements des coût personnels:", error);
        throw error;
    }
    
};
//Récuperer un employé par ID 
export const getEmployeById = async (id) =>{
    try{
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }catch(error){
        console.error(`Erreur lors du chargements de ${id}`, error);
        throw error;
    }
};

//Mettre à jour les charges d'un employé
export const updateEmploye = async (id, employe) => {
    try{
        const response = await axios.put(`${API_URL}/${id}`,employe);
    return response.data;
    }catch(error){
        console.error(`Erreur lors de la mise à jour de ${id}`, error);
        throw error;
    }
   
};
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./produits.css";

function CreateProduit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    typeProduit: "Crédit",
    fraisDirects: 0,
    nombreUnites: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pour l'instant on simule l'enregistrement
    console.log("Produit créé :", formData);

    // Après enregistrement → retour à la liste Produits
    navigate("/produits");
  };

  return (
    <div className="produits-page">
      <h2>+ Nouveau produit</h2>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom du produit</label>
          <input
            type="text"
            name="nom"
            className="form-control"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type de produit</label>
          <select
            name="typeProduit"
            className="form-select"
            value={formData.typeProduit}
            onChange={handleChange}
          >
            <option value="Crédit">Crédit</option>
            <option value="Épargne">Épargne</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Frais directs (Ar)</label>
          <input
            type="number"
            name="fraisDirects"
            className="form-control"
            value={formData.fraisDirects}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre d’unités</label>
          <input
            type="number"
            name="nombreUnites"
            className="form-control"
            value={formData.nombreUnites}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default CreateProduit;

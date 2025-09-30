import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduit } from "../../services/produitService";
import "./produits.css";

function CreateProduit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    typeProduit: "Crédit"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createProduit(formData);
      console.log("Produit créé avec succès :", formData);
      // Retour à la liste des produits après création
      navigate("/produits");
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
      setError("Erreur lors de la création du produit. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="produits-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>+ Nouveau produit</h2>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => navigate("/produits")}
        >
          ← Retour à la liste
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Nom du produit <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="nom"
            className="form-control"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Saisissez le nom du produit"
            required
            maxLength="100"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">
            Type de produit <span className="text-danger">*</span>
          </label>
          <select
            name="typeProduit"
            className="form-select"
            value={formData.typeProduit}
            onChange={handleChange}
            required
          >
            <option value="Crédit">Crédit</option>
            <option value="Épargne">Épargne</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-success" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enregistrement...
              </>
            ) : (
              "✓ Enregistrer"
            )}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate("/produits")}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProduit;
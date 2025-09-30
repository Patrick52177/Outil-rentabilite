import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProduits, deleteProduit } from "../../services/produitService";
import "./produits.css";

const ProduitsPage = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const data = await getProduits();
      console.log("Produits reçus :", data); // 🔥 Vérifier ici
      setProduits(data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer ce produit ?")) return;
    try {
      await deleteProduit(id);
      fetchProduits();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit", error);
    }
  };

  return (
    <div className="produits-page">
      <h2>Liste des Produits</h2>

      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.length > 0 ? (
            produits.map((p) => (
              <tr key={p.id}>
                <td>{p.nom}</td>
                <td>{p.typeProduit}</td>
                <td>
                  <Link className="btn btn-sm btn-info me-2" to={`/produits/${p.id}`}>
                    Voir
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Aucun produit trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="fab-btn" onClick={() => navigate("/produits/nouveau")}>
        <span className="plus-icon">+</span> Nouveau produit
      </button>
    </div>
  );
};

export default ProduitsPage;

import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./produits.css";

const ProduitsPage = () => {
    const navigate = useNavigate();
  const produits = [
    { id: 1, nom: "Crédit habitat", type: "Crédit" },
    { id: 2, nom: "Épargne jeunesse", type: "Épargne" },
    { id: 3, nom: "Carte bancaire", type: "Service" },
  ];

  return (
    <div className="produits-page">
      <h2>Liste des Produits</h2>

      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.map((p) => (
            <tr key={p.id}>
              <td>{p.nom}</td>
              <td>{p.type}</td>
              <td>
                <Link className="btn btn-sm btn-info" to={`/produits/${p.id}`}>
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Bouton flottant */}
      <button className="fab-btn" onClick={() => navigate("/produits/nouveau")}>
        <span className="plus-icon">+</span> Nouveau produit
      </button>
    </div>
  );
};

export default ProduitsPage;

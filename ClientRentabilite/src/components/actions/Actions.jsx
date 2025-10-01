import { Link } from "react-router-dom";
import Layout from "../layout/Layout";   // ✅ chemin corrigé

export default function Actions() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Actions Produit</h2>
        {/* Bouton vers la modification des coûts employés */}
        <Link to="/employes" className="btn btn-outline-secondary">
          <i className="bi bi-person-gear me-2"></i>
          Modifier coûts personnels
        </Link>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Nom Action</th>
            <th>Nombre d’actions</th>
            <th>Minutes / action</th>
            <th>Employé assigné</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ouverture de compte</td>
            <td><input type="number" className="form-control" /></td>
            <td><input type="number" className="form-control" /></td>
            <td>
              <select className="form-select">
                <option>Chef adjoint</option>
                <option>Assistant agence</option>
              </select>
            </td>
            <td><button className="btn btn-success btn-sm">Sauver</button></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

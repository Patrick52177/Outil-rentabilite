import Layout from "../layout/Layout";

export default function Employes() {
  const employes = [
    { id: 1, nom: "Chef adjoint", indemnite: 1000, logement: 500, transport: 200, carburant: 150, autres: 50 },
    { id: 2, nom: "Assistant agence", indemnite: 800, logement: 400, transport: 150, carburant: 100, autres: 30 },
  ];

  return (
    <>
      <h2>Paramètres Employés</h2>
      <form>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nom</th>
              <th>Indemnité</th>
              <th>Logement</th>
              <th>Transport</th>
              <th>Carburant</th>
              <th>Autres</th>
            </tr>
          </thead>
          <tbody>
            {employes.map(emp => (
              <tr key={emp.id}>
                <td>{emp.nom}</td>
                <td><input type="number" className="form-control" defaultValue={emp.indemnite} /></td>
                <td><input type="number" className="form-control" defaultValue={emp.logement} /></td>
                <td><input type="number" className="form-control" defaultValue={emp.transport} /></td>
                <td><input type="number" className="form-control" defaultValue={emp.carburant} /></td>
                <td><input type="number" className="form-control" defaultValue={emp.autres} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="btn btn-success">Enregistrer</button>
      </form>
    </>
  );
}

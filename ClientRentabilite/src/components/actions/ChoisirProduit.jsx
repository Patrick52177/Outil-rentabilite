import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProduits } from "../../services/produitService";
import Layout from "../layout/Layout";

export default function ChoisirProduit(){
    const [produits, setProduits] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> { 
        getProduits().then(setProduits).catch(console.error);
    }, []);

    return (
        <>
            <h2>Choisir le produit</h2>
            <table className="table table-striped"> 
                <thead className="table-dark">
                    <tr>
                        <th>Nom</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((p)=> (
                        <tr key={p.id}>
                            <td>{p.nom}</td>
                            <td>{p.typeProduit}</td>
                            <td>
                                <button className="btn btn-success btn-sm" onClick={()=>navigate(`/coût-unitaire/${p.id}`)}>
                                    Choisir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
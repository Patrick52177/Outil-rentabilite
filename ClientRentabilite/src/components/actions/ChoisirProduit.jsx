import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProduits, initActions } from "../../services/produitService";
import Layout from "../layout/Layout";

export default function ChoisirProduit(){
    const [produits, setProduits] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const navigate = useNavigate();

    useEffect(()=> { 
        getProduits().then(setProduits).catch(console.error);
    }, []);

    const handleChoisir = async (produitId) => {
        try{
            setLoadingId(produitId);
            await initActions(produitId); // initialise automatiquement les actions
            navigate(`/coût-unitaire/${produitId}`);
        } catch(error){
            alert("Erreur : impossible d'initialiser les actions pour ce produit!")
        } finally{
            setLoadingId(null);
        }
    };
 
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
                                <button className="btn btn-success btn-sm" onClick={()=>handleChoisir(p.id)}
                                    disabled={loadingId === p.id}>
                                    {loadingId === p.id ? "Initialisation..." : "Choisir"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
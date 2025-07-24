using OutilRentabilite.Models;

namespace OutilRentabilite.Services;

public class SimulationService
{
    public ResultatSimulation CalculerResultat(ParametresSimulation param, ProduitFinancier produit)
    {
        decimal revenu = 0;
        decimal coutTotal = 0;
        float Roa = 0;
       
        decimal encourTotal = 0;
         decimal fondPropre = 0;
        switch (produit.TypeProduit)
        {
            case "Crédit":
                revenu = param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12 *param.NombreOffre +param.FraisDossier ;
                coutTotal = param.CoutFinancement + param.CoutRisque + param.CoutOperationnel;
                Roa = param.Montant == 0 ? 0 : (float)((revenu - coutTotal) / (param.Montant*param.NombreOffre)) * 100;
                //calcule pour Roe
                encourTotal = param.Montant * param.NombreOffre;
                fondPropre = encourTotal * 0.10m;// le banque doit bloqué 10% pour ces fonds pour le crédit
               
                break;

            case "Epargne":
                revenu = param.Montant* param.NombreOffre * 0.07m * param.DureeMois / 12 + param.FraisGestion;
                coutTotal += param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12 * param.NombreOffre;
                Roa = param.Montant == 0 ? 0 : (float)((revenu - coutTotal) / (param.Montant* param.NombreOffre)) * 100;
                //calcule pour Roe
                encourTotal = param.Montant * param.NombreOffre;
                fondPropre = encourTotal * 0.4m; //  le banque doit bloqué 10% pour ces fonds pour le crédit


                break;

            case "Services":
                decimal Frais = param.Montant;
                revenu = Frais * param.NombreOffre;
                coutTotal = param.CoutFinancement +  param.CoutOperationnel;
                fondPropre = param.FondsPropres;
                
                break;
        }
       
        
        decimal benefice = revenu - coutTotal ;
        decimal resultatnet = (revenu - coutTotal) * 70;
        var margeNet = revenu != 0 ? (float)(resultatnet / revenu * 100) : 0;
        decimal beneficeMensuel = param.DureeMois == 0 ? 0 :(decimal)(margeNet / param.DureeMois);
        var margeBrute = revenu - coutTotal;
        var tauxMargeBrute = revenu != 0 ? (margeBrute / revenu) * 100 : 0;
        float Roe = fondPropre == 0 ? 0 : (float)((revenu - coutTotal) / fondPropre) * 100;
        return new ResultatSimulation
        {
            RevenuTotal = revenu,
            CoutTotal = coutTotal,
            BeneficeNet = benefice,
            MargeNette = margeNet,
            MargeBrute = (float)tauxMargeBrute,
            PaybackPeriod = beneficeMensuel == 0 ? 0 : (coutTotal / beneficeMensuel),
            ROI = coutTotal != 0 ? (float)(resultatnet / coutTotal * 100) : 0,
            ROE = Roe, // valeur fictive
            ROA = Roa // valeur fictive
        };
    }
}

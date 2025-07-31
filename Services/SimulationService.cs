using OutilRentabilite.Models;

namespace OutilRentabilite.Services;

public class SimulationService
{    


    public ResultatSimulation CalculerResultat(ParametresSimulation param, ProduitFinancier produit)
    {
        decimal coutfinance = param.Montant * param.CoutFinancement/100 * param.DureeMois / 12 * param.NombreOffre;
        decimal coutRisque = param.Montant * param.CoutRisque/100 * param.NombreOffre;
        decimal coutOpera = param.CoutOperationnel * param.NombreOffre;
        decimal fraisdossier = param.FraisDossier * param.NombreOffre;
        decimal revenu = 0;
        decimal coutTotal = 0;
        float Roa = 0;
        decimal encourTotal = 0;
         decimal fondPropre = 0;
        switch (produit.TypeProduit)
        {
            case "Crédit":
                revenu = param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12 *param.NombreOffre + fraisdossier ;
                coutTotal = coutfinance+coutOpera+coutRisque;
                //calcule pour Roe
                encourTotal = param.Montant * param.NombreOffre;
                fondPropre = encourTotal * 0.1m;// le banque doit bloqué 10% pour ces fonds pour le crédit
               
                break;

            case "Epargne":
                revenu = param.Montant* param.NombreOffre * 0.07m * param.DureeMois / 12 + param.FraisGestion;
                coutTotal += param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12 * param.NombreOffre;
              
                //calcule pour Roe
                encourTotal = param.Montant * param.NombreOffre;
                fondPropre = encourTotal * 0.4m; //  le banque doit bloqué 10% pour ces fonds pour le crédit


                break;

            case "Services":
                decimal Frais = param.Montant;
                param.NombreOffre = 1;
                revenu = Frais;
                coutTotal = param.CoutFinancement +  param.CoutOperationnel;
                fondPropre = param.FondsPropres;
                
                break;
        }
       
        
        decimal benefice = revenu - coutTotal ;
        decimal resultatnet = (revenu - coutTotal) * 0.7m;
        var margeNet = revenu != 0 ? (float)(resultatnet / revenu * 100) : 0;
        decimal beneficeMensuel = param.DureeMois == 0 ? 0 :(decimal)(margeNet / param.DureeMois);
        Roa = param.Montant == 0 ? 0 : (float)(resultatnet / (param.Montant * param.NombreOffre)) * 100;
        var margeBrute = revenu - coutTotal;
        var tauxMargeBrute = revenu != 0 ? (margeBrute / revenu) * 100 : 0;
        float Roe = fondPropre == 0 ? 0 : (float)(resultatnet / fondPropre) * 100;
        return new ResultatSimulation
        {
            RevenuTotal = revenu,
            CoutTotal = coutTotal,
            BeneficeNet = resultatnet,
            MargeNette = margeNet,
            MargeBrute = (float)tauxMargeBrute,
            PaybackPeriod = beneficeMensuel == 0 ? 0 : (coutTotal / beneficeMensuel),
            ROI = coutTotal != 0 ? (float)(resultatnet / (param.TotalActif+param.Montant) * 100) : 0,
            ROE = Roe, // valeur fictive
            ROA = Roa // valeur fictive
        };
    }
}

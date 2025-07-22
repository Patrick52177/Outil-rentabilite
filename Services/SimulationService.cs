using OutilRentabilite.Models;

namespace OutilRentabilite.Services;

public class SimulationService
{
    public ResultatSimulation CalculerResultat(ParametresSimulation param, ProduitFinancier produit)
    {
        decimal revenu = 0;
        decimal coutTotal = param.FraisDossier + param.CoutFinancement + param.CoutRisque + param.CoutOperationnel;

        switch (produit.TypeProduit)
        {
            case "Crédit":
                revenu = param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12;
                break;

            case "Epargne":
                revenu = param.Montant * 0.07m * param.DureeMois / 12;
                coutTotal += param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12;
                break;

            case "Services":
                revenu = param.Montant;
                break;
        }

        decimal benefice = revenu - coutTotal;
        var margeBrute = revenu - coutTotal;
        var tauxMargeBrute = revenu != 0 ? (margeBrute / revenu) * 100 : 0;

        return new ResultatSimulation
        {
            RevenuTotal = revenu,
            CoutTotal = coutTotal,
            BeneficeNet = benefice,
            MargeNette = revenu != 0 ? (float)(benefice / revenu * 100) : 0,
            MargeBrute = (float)tauxMargeBrute,
            ROI = coutTotal != 0 ? (float)(benefice / coutTotal * 100) : 0,
            ROE = 10f, // valeur fictive
            ROA = 5f   // valeur fictive
        };
    }
}

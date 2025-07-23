using OutilRentabilite.Models;

namespace OutilRentabilite.Services;

public class SimulationService
{
    public ResultatSimulation CalculerResultat(ParametresSimulation param, ProduitFinancier produit)
    {
        decimal revenu = 0;
        decimal coutTotal =  param.CoutFinancement + param.CoutRisque + param.CoutOperationnel;

        switch (produit.TypeProduit)
        {
            case "Crédit":
                revenu = param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12 +param.FraisDossier ;
                break;

            case "Epargne":
                revenu = param.Montant * 0.07m * param.DureeMois / 12;
                coutTotal += param.Montant * (decimal)param.TauxInteret / 100 * param.DureeMois / 12;
                break;

            case "Services":
                revenu = param.Montant;
                break;
        }

        decimal benefice = revenu - coutTotal ;
        var margeNet = revenu != 0 ? (float)(benefice / revenu * 100) : 0;
        decimal beneficeMensuel = param.DureeMois == 0 ? 0 :(decimal)(margeNet / param.DureeMois);
        var margeBrute = revenu - coutTotal;
        var tauxMargeBrute = revenu != 0 ? (margeBrute / revenu) * 100 : 0;

        return new ResultatSimulation
        {
            RevenuTotal = revenu,
            CoutTotal = coutTotal,
            BeneficeNet = benefice,
            MargeNette = margeNet,
            MargeBrute = (float)tauxMargeBrute,
            PaybackPeriod = beneficeMensuel == 0 ? 0 : (coutTotal / beneficeMensuel),
            ROI = coutTotal != 0 ? (float)(benefice / coutTotal * 100) : 0,
            ROE = param.TotalActif == 0 ? 0 : (float)(benefice / param.TotalActif) * 100, // valeur fictive
            ROA = param.FondsPropres == 0 ? 0 : (float)(benefice / param.FondsPropres) * 100 // valeur fictive
        };
    }
}

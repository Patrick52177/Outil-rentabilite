namespace OutilRentabilite.Models;

public class AnalyseProduitViewModel
{
    public string Nom { get; set; }
    public string TypeProduit { get; set; }
    public decimal RevenuMoyen { get; set; }
    public decimal CoutMoyen { get; set; }
    public decimal BeneficeMoyen { get; set; }
    public float MargeBruteMoyenne { get; set; }
    public float MargeNetteMoyenne { get; set; }
    public float ROIMoyen { get; set; }
    public float ROEMoyen { get; set; }
    public float ROAMoyen { get; set; }
}

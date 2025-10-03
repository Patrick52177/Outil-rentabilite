namespace OutilRentabilite.Models;

public class ParametresGenerauxProduit
{
    public int Id { get; set; }
    public int ProduitFinancierId { get; set; }
    public ProduitFinancier? ProduitFinancier { get; set; }
    public decimal LivretPa { get; set; }
    public decimal Bordereau { get; set; }
    public decimal Informatique { get; set; }
    public decimal Communication{ get; set; }
}
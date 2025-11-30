using System.ComponentModel.DataAnnotations;

namespace OutilRentabilite.Models;

public class ProduitFinancier
{
    public int Id { get; set; }

    [Required]
    public string? Nom { get; set; }

    [Required]
    public string? TypeProduit { get; set; } // "Crédit", "Épargne", "Service"

    public ParametresGenerauxProduit? ParametresGenerauxProduit{ get; set; }

    public ICollection<ActionProduit>? Actions { get; set; } = new List<ActionProduit>();

    public ICollection<ResultatCalcul>? Resultats { get; set; }
    
}

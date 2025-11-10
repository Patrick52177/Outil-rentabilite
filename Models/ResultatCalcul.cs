using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OutilRentabilite.Models;

public class ResultatCalcul
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ProduitFinancierId { get; set; }
    
    [ForeignKey("ProduitFinancierId")]
    public ProduitFinancier? ProduitFinancier { get; set; }

    public DateTime DateCalcul { get; set; } = DateTime.Now;

    [Required]
    public decimal CoutUnitairePartiel { get; set;}
} 
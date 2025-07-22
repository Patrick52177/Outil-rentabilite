using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OutilRentabilite.Models
{
    public class ParametresSimulation
    {
        public int Id { get; set; }

        [Required]
        [Display(Name ="Produit Financier")]
        public int ProduitFinancierId { get; set; }

        [ForeignKey("ProduitFinancierId")]
        public ProduitFinancier? ProduitFinancier { get; set; }

        [Required]
        public decimal Montant { get; set; }

        [Required]
        public int DureeMois { get; set; }

        [Required]
        public float TauxInteret { get; set; }

        [Required]
        public decimal FraisDossier { get; set; }

        [Required]
        public decimal CoutFinancement { get; set; }

        [Required]
        public decimal CoutRisque { get; set; }

        [Required]
        public decimal CoutOperationnel { get; set; }

        public ResultatSimulation? Resultat { get; set; }
    }
}

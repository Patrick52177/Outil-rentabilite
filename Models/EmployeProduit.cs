using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OutilRentabilite.Models
{
    public class EmployeProduit
    {
        // Composite key configured in DbContext (EmployeId + ProduitId)
        public int EmployeId { get; set; }
        public Employe? Employe { get; set; }

        public int ProduitFinancierId { get; set; }
        public ProduitFinancier? ProduitFinancier { get; set; }

        // Minutes consacrées par l'employé à ce produit (par période simulée)
        [Required]
        public int MinutesConsacrees { get; set; }

        // Optionnel: date / période de référence
        public DateTime? DateAffectation { get; set; }

        // Computed (not mapped) : coût employé pour ce produit
        [NotMapped]
        public decimal CoutEmployePourProduit => (Employe == null) ? 0 : Math.Round(Employe.CoutParMinute * MinutesConsacrees, 4);
    }
}

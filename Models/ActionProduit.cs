using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OutilRentabilite.Models;

public class ActionProduit
{
    public int Id { get; set; }

    [Required]
    public int ProduitFinancierId { get; set; }
    public ProduitFinancier? ProduitFinancier { get; set; }

    [Required]
    public int EmployeId { get; set; }
    public Employe? Employe { get; set; }

    public int TypeActionId { get; set; }
    public TypeAction TypeAction { get; set; }

    [Required, StringLength(100)]
    public string NomAction { get; set; } = "";

    // Ex: nombre d’actions par an
    public decimal NombreActions { get; set; }

    // Ex: minutes par action
    public int MinutesParAction { get; set; }

    // Calculs
    [NotMapped]
    public decimal TotalMinutes => NombreActions * MinutesParAction;

    [NotMapped]
    public decimal CoutAction => Employe != null ? TotalMinutes * Employe.CoutParMinute : 0;
}

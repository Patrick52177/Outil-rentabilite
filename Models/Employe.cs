using System.ComponentModel.DataAnnotations;
using OutilRentabilite.Models;

namespace OutilRentabilite.Models;
public class Employe
{
    public int Id { get; set; }

    [Required, StringLength(150)]
    public string Nom { get; set; } = "";

    // === Indemnités ===
    public decimal IndemniteBase { get; set; }
    public decimal ComplementSalaire { get; set; }
    public decimal Assiduite { get; set; }
    public decimal Responsabilite { get; set; }
    public decimal Fonction { get; set; }
    public decimal Restauration { get; set; }
    public decimal Entretien { get; set; }
    public decimal WU { get; set; }
    public decimal Logement { get; set; }
    public decimal Technicite { get; set; }
    public decimal Transport { get; set; }
    public decimal Caisse { get; set; }
    public decimal Representation { get; set; }

    // === Charges patronales ===
    public decimal FraisMedicaux { get; set; }
    public decimal CSR { get; set; }
    public decimal OSIE { get; set; }
    public decimal CNaPS { get; set; }

    // === Œuvres sociales ===
    public decimal TicketsPPN { get; set; }
    public decimal AideScolaire { get; set; }
    public decimal VoitureAmortissement { get; set; }

    // === Autres infos ===
    public int HeuresDisponiblesParAn { get; set; } = (int)60m;
    public int MinutesDisponiblesParAn => HeuresDisponiblesParAn * 60;

    // Navigation
    public ICollection<EmployeProduit>? EmployeProduits { get; set; }

    // Calcul total
    public decimal CoutAnnuelTotal =>
        IndemniteBase + ComplementSalaire + Assiduite + Responsabilite +
        Fonction + Restauration + Entretien + WU + Logement + Technicite +
        Transport + Caisse + Representation +
        FraisMedicaux + CSR + OSIE + CNaPS +
        TicketsPPN + AideScolaire + VoitureAmortissement;

    public decimal CoutParMinute =>
        MinutesDisponiblesParAn == 0 ? 0 : Math.Round(CoutAnnuelTotal / MinutesDisponiblesParAn, 4);
}

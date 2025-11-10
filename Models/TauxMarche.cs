using System;
using System.ComponentModel.DataAnnotations;

namespace OutilRentabilite.Models
{
    public class TauxMarche
    {
        [Key]
        public int Id { get; set; }

        // Taux de placement
        public decimal TauxPlacementJourLeJour { get; set; }
        public decimal BTA30 { get; set; }
        public decimal BTA90 { get; set; }
        public decimal BTA180 { get; set; }
        public decimal BTA360 { get; set; }

        // Autres paramètres
        public decimal TauxIRCM { get; set; }
        public decimal ReserveObligatoire { get; set; }
        public decimal TauxInteret { get; set; }
        public decimal Refinancement { get; set; }

        // Marge pour calcul d’emprunt
        public decimal Marge { get; set; }

        public DateTime DateEnregistrement { get; set; } = DateTime.Now;
    }
}

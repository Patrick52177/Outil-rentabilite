using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OutilRentabilite.Models;

public class ResultatSimulation
{
    public int Id { get; set; }

    public decimal RevenuTotal { get; set; }
    public decimal CoutTotal { get; set; }
    public decimal BeneficeNet { get; set; }
    public decimal PaybackPeriod { get; set; }
    public float MargeBrute { get; set; }
    public float MargeNette { get; set; }
    public float ROI { get; set; }
    public float ROE { get; set; }
    public float ROA { get; set; }
    [Required]
    public int ParametresSimulationId { get; set; }

    [Required]
    [ForeignKey("ParametresSimulationId")]
    public ParametresSimulation? parametresSimulation { get; set; }

}

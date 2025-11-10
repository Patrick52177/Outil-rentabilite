namespace OutilRentabilite.Dto;

public class UpdateActionProduitDto
{
    public int? EmployeId { get; set; }

    public decimal NombreActions { get; set; }
    
    public int MinutesParAction{ get; set; }
}
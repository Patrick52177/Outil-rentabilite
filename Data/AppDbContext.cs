using Microsoft.EntityFrameworkCore;
using OutilRentabilite.Models;

namespace OutilRentabilite.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<ProduitFinancier>? ProduitsFinanciers { get; set; }
    public DbSet<ParametresSimulation>? ParametresSimulations { get; set; }
    public DbSet<Employe>? Employes { get; set; }
    public DbSet<EmployeProduit>? EmployeProduits { get; set; }
    public DbSet<ResultatSimulation>? ResultatsSimulations { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relation 1:1 entre ParametresSimulation et ResultatSimulation
        modelBuilder.Entity<ParametresSimulation>()
            .HasOne(p => p.Resultat)
            .WithOne(r => r.parametresSimulation)
            .HasForeignKey<ResultatSimulation>(r => r.ParametresSimulationId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relation 1:N entre ProduitFinancier et ParametresSimulation
        modelBuilder.Entity<ProduitFinancier>()
            .HasMany(p => p.Simulations)
            .WithOne(s => s.ProduitFinancier)
            .HasForeignKey(s => s.ProduitFinancierId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<EmployeProduit>(eb =>
        {
            eb.HasKey(e => new { e.EmployeId, e.ProduitFinancierId });

            eb.HasOne(e => e.Employe)
              .WithMany(emp => emp.EmployeProduits)
              .HasForeignKey(e => e.EmployeId)
              .OnDelete(DeleteBehavior.Cascade);

            eb.HasOne(e => e.ProduitFinancier)
              .WithMany(p => p.EmployeProduits) // careful: existing Simulations nav; if clash, add a new nav in ProduitFinancier
              .HasForeignKey(e => e.ProduitFinancierId)
              .OnDelete(DeleteBehavior.Cascade);

            // Precision for MinutesConsacrees not needed; keep int
        });

        // Decimal precision global (ensure NUMBER(18,4))
        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetPrecision(18);
            property.SetScale(4);
        }


    }
}

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
    //public DbSet<ParametresSimulation>? ParametresSimulations { get; set; }
    public DbSet<Employe>? Employes { get; set; }
    //public DbSet<ResultatSimulation>? ResultatsSimulations { get; set; }
    public DbSet<ActionProduit> ActionsProduits { get; set; }
  //  public DbSet<TypeAction> TypeActions { get; set; }
    public DbSet<ParametresGenerauxProduit> ParametresGenerauxProduits { get; set; }
    public DbSet<ResultatCalcul> ResultatCalculs { get; set; }

    public DbSet<TauxMarche> TauxMarches { get; set; }

  
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ActionProduit>()
        .HasOne(a => a.ProduitFinancier)
        .WithMany(p => p.Actions)
        .HasForeignKey(a => a.ProduitFinancierId);

        modelBuilder.Entity<ActionProduit>()
            .HasOne(a => a.Employe)
            .WithMany()
            .HasForeignKey(a => a.EmployeId);

        modelBuilder.Entity<ProduitFinancier>()
            .HasMany(p => p.Resultats)
            .WithOne(r => r.ProduitFinancier)
            .HasForeignKey(r => r.ProduitFinancierId)
            .OnDelete(DeleteBehavior.Cascade);

      
            
            

       /* // Relation 1:1 entre ParametresSimulation et ResultatSimulation
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
  */

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

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


    }
}

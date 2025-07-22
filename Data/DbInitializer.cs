using OutilRentabilite.Models;



namespace OutilRentabilite.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        if (context.ProduitsFinanciers.Count() == 0)
        {
            context.ProduitsFinanciers.AddRange(
                new ProduitFinancier
                {
                    Nom = "Crédit personnel",
                    TypeProduit = "Crédit"
                   
                },
                 new ProduitFinancier
                 {
                     Nom = "Compte épargne",
                     TypeProduit = "Epargne",
                 },
                  new ProduitFinancier
                  {
                      Nom = "Carte bancaire",
                      TypeProduit = "Services"
                    
                  });
            context.SaveChanges();
        }
    }
}

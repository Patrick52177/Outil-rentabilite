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
                    Nom = "Crédit Avotra",
                    TypeProduit = "Crédit"
                   
                },
                 new ProduitFinancier
                 {
                     Nom = "Crédit Safidy",
                     TypeProduit = "Crédit"

                 },
                 new ProduitFinancier
                 {
                     Nom = "Compte épargne",
                     TypeProduit = "Epargne",
                 },
                 new ProduitFinancier
                 {
                     Nom = "Compte Retraite",
                     TypeProduit = "Epargne",
                 },
                  new ProduitFinancier
                  {
                      Nom = "Carte bancaire",
                      TypeProduit = "Services"
                    
                  });
            context.Employes.AddRange(
              new Employe { Id = 1, Nom = "Chef de service agence" },
              new Employe { Id = 2, Nom = "Adjoint agence" },
              new Employe { Id = 3, Nom = "Assistant agence" },
              new Employe { Id = 4, Nom = "Employe 2 agence" }
                  );
            context.TypeActions.AddRange(
              new TypeAction { Id = 1, Nom = "Ouverture" },
              new TypeAction { Id = 2, Nom = "clôture" },
              new TypeAction { Id = 3, Nom = "Tenue" },
              new TypeAction { Id = 4, Nom = "Transaction en espèce" },
              new TypeAction { Id = 5, Nom = "Transaction scripturales" }
                  );
            context.SaveChanges();
        }
    }
}

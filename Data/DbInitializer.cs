using OutilRentabilite.Models;



namespace OutilRentabilite.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
     
        if (context.Employes.Count() == 0)
        {
            context.Employes.AddRange(
              new Employe { Id = 1, Nom = "Chef de service agence" },
              new Employe { Id = 2, Nom = "Adjoint agence" },
              new Employe { Id = 3, Nom = "Assistant agence" },
              new Employe { Id = 4, Nom = "Employe 2 agence" }
                  );
                  context.SaveChanges();
        }

    /*    if (context.ProduitsFinanciers.Count() == 0)
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


            context.SaveChanges();*/

           /* var employeDefault = context.Employes.First();
            foreach (var produit in context.ProduitsFinanciers)
            {
                foreach (var action in new[]{
                    "Ouverture", "Clôture", "tenue","Transaction en éspèces","transaction scripturale"
                })
                {
                    context.ActionsProduits.Add(new ActionProduit
                    {
                        ProduitFinancierId = produit.Id,
                        Nom = action,
                        EmployeId = employeDefault.Id,
                        MinutesParAction = 0,
                        NombreActions = 0
                    });
                }
            }
            context.SaveChanges();*/
        }
    }

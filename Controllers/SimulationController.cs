using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutilRentabilite.Data;
using OutilRentabilite.Models;
using OutilRentabilite.Services;

namespace OutilRentabilite.Controllers
{
    public class SimulationController : Controller
    {
        private readonly AppDbContext _context;
        private readonly SimulationService _service;

        public SimulationController(AppDbContext context, SimulationService service)
        {
            _context = context;
            _service = service;
        }

        // Étape 1 : Choisir un produit
        [HttpGet]
        public IActionResult ChoisirProduit()
        {
            ViewBag.Produits = _context.ProduitsFinanciers.ToList();
            return View();
        }

        [HttpPost]
        public IActionResult ChoisirProduit(int produitId)
        {
            return RedirectToAction("Create", new { produitId = produitId });
        }

        // Étape 2 : Afficher le formulaire de simulation
        [HttpGet]
        public IActionResult Create(int? produitId)
        {
            var model = new ParametresSimulation();
            if (produitId.HasValue)
            {
                model.ProduitFinancierId = produitId.Value;
                var produit = _context.ProduitsFinanciers.FirstOrDefault(p =>p.Id == produitId.Value);
                if (produit != null)
                {
                    ViewBag.NomProduit = produit.Nom;
                    ViewBag.TypeProduit = produit.TypeProduit.ToLower();

                }
            }

            ViewBag.Produits = _context.ProduitsFinanciers.ToList();

            return View(model);
        }

        // Étape 3 : Traiter la simulation et calculer les résultats
        [HttpPost]
        public IActionResult Create(ParametresSimulation param)
        {
            var produit = _context.ProduitsFinanciers.Find(param.ProduitFinancierId);
           
            if (produit == null)
            {
                ModelState.AddModelError("", "Produit introuvable.");
                return View(param);
            }

            param.DateSimulation = DateTime.Now;
            // Appel au service de calcul
            // Calcul des résultats
            var resultat = _service.CalculerResultat(param, produit);
            param.Resultat = resultat;

            // Enregistrement en base
            _context.ParametresSimulations.Add(param);
            _context.SaveChanges();

            // Générer la suggestion automatiquement
            string suggestion = "";

            if (resultat.MargeNette < 20)
                suggestion = "⚠️ Marge faible : Réduisez les coûts ou augmentez le taux.";
            else if (resultat.ROI < 10)
                suggestion = "⚠️ ROI faible : Optimisez les frais ou augmentez les volumes.";
            else
                suggestion = "✅ Produit rentable. Aucun ajustement nécessaire.";

            ViewBag.Suggestion = suggestion;

            return PartialView("_ResultatSimulation", param);
        }

        // Étape 4 : Afficher les résultats
        public IActionResult Resultat(int id)
        {
            var simulation = _context.ParametresSimulations
                .Include(p => p.ProduitFinancier)
                .Include(p => p.Resultat)
                .FirstOrDefault(p => p.Id == id);

            if (simulation == null)
                return NotFound();
            ViewBag.NomProduit = simulation.ProduitFinancier?.Nom ?? "Inconnu";
            ViewBag.TypeProduit = simulation.ProduitFinancier?.TypeProduit ?? "Inconnu";
            if (simulation.Resultat != null)
            {
                var benefice = simulation.Resultat.BeneficeNet;
                var marge = simulation.Resultat.MargeBrute;
                var ajustement = GenererSuggestion(simulation.Resultat);
                ViewBag.Suggestion = ajustement;
            }


            return View(simulation);
        }
        private string GenererSuggestion(ResultatSimulation resultat)
        {
            if (resultat.MargeNette < 20)
                return "La marge nette est faible. Essayez d’augmenter le taux d’intérêt ou de réduire les coûts.";

            if (resultat.ROI < 50)
                return "Le ROI est bas. Envisagez d’optimiser l’investissement ou de revoir la stratégie du produit.";

            if (resultat.BeneficeNet < 0)
                return "Ce produit génère une perte. Réévaluez les paramètres financiers ou envisagez l’arrêt du produit.";

            return "Les indicateurs sont bons. Aucun ajustement nécessaire.";
        }
        public IActionResult Historique()
        {
            var simulations = _context.ParametresSimulations
                .Include(p => p.ProduitFinancier)
                .Include(p => p.Resultat)

                .OrderByDescending(p => p.DateSimulation)
                .ToList();

            return View(simulations);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Supprimer(int id)
        {
            var simulation = _context.ParametresSimulations
                .Include(p => p.Resultat)
                .FirstOrDefault(p => p.Id == id);

            if (simulation != null)
            {
                _context.ParametresSimulations.Remove(simulation);
                _context.SaveChanges();
            }

            return RedirectToAction("Historique");
        }
        [HttpGet]
        public IActionResult Analyse(DateTime? dateDebut, DateTime? dateFin)
        {
            var produits = _context.ProduitsFinanciers
                .Include(p => p.Simulations)
                .ThenInclude(s => s.Resultat)
                .Where(p => p.Simulations.Any(s => s.Resultat != null &&
                    (!dateDebut.HasValue || s.DateSimulation >= dateDebut.Value) &&
                    (!dateFin.HasValue || s.DateSimulation <= dateFin.Value)))
                .ToList();

            var analyses = produits.Select(p => new AnalyseProduitViewModel
            {
                Nom = p.Nom,
                TypeProduit = p.TypeProduit,
                RevenuMoyen = p.Simulations
                    .Where(s => s.Resultat != null &&
                        (!dateDebut.HasValue || s.DateSimulation >= dateDebut.Value) &&
                        (!dateFin.HasValue || s.DateSimulation <= dateFin.Value))
                    .Average(s => (decimal?)s.Resultat.RevenuTotal) ?? 0,
                BeneficeMoyen = p.Simulations
                    .Where(s => s.Resultat != null &&
                        (!dateDebut.HasValue || s.DateSimulation >= dateDebut.Value) &&
                        (!dateFin.HasValue || s.DateSimulation <= dateFin.Value))
                    .Average(s => (decimal?)s.Resultat.BeneficeNet) ?? 0
            }).ToList();

            // Trouver le produit le plus rentable par type
            var meilleursProduits = analyses
                .Where(a => a.BeneficeMoyen > 0)
                .GroupBy(a => a.TypeProduit)
                .Select(g => g.OrderByDescending(p => p.BeneficeMoyen).First())
                .ToList();

            ViewBag.MeilleursProduits = meilleursProduits;

            ViewBag.DateDebut = dateDebut?.ToString("yyyy-MM-dd");
            ViewBag.DateFin = dateFin?.ToString("yyyy-MM-dd");

            return View(analyses);
        }
        [HttpPost]
        public IActionResult SimulerInline(ParametresSimulation param)
        {
            try
            {
                var produit = _context.ProduitsFinanciers.Find(param.ProduitFinancierId);
                if (produit == null)
                    return BadRequest("Produit introuvable");

                param.DateSimulation = DateTime.Now;
                param.Resultat = _service.CalculerResultat(param, produit);

                return PartialView("_ResultatSimulation", param.Resultat);
            }
            catch (Exception ex)
            {
                return BadRequest("Erreur : " + ex.Message);
            }
        }



    }
}

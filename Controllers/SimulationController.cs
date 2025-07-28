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
            param.Resultat = _service.CalculerResultat(param, produit);

            _context.ParametresSimulations.Add(param);
            _context.SaveChanges();
            
            

            return RedirectToAction("Resultat", new { id = param.Id });
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

            return View(simulation);
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
        public IActionResult Analyse()
         {
               var analyses = _context.ProduitsFinanciers
                  .Include(p => p.Simulations)
         .ThenInclude(s => s.Resultat)
        .Select(p => new {
          Nom = p.Nom,
          Type = p.TypeProduit,
          NbSimulation = p.Simulations.Count,
          MoyenneRevenu = p.Simulations.Average(s =>(decimal?)s.Resultat.RevenuTotal) ?? 0,
          MoyenneCout = p.Simulations.Average(s =>(decimal?)s.Resultat.CoutTotal) ?? 0,
          MoyenneBenefice = p.Simulations.Average(s =>(decimal?)s.Resultat.BeneficeNet) ?? 0,
          MoyenneMargeBrute = p.Simulations.Average(s =>(decimal?)s.Resultat.MargeBrute) ?? 0,
          MoyenneMargeNette = p.Simulations.Average(s =>(decimal?)s.Resultat.MargeNette) ?? 0,
          MoyenneROI = p.Simulations.Average(s =>(float?)s.Resultat.ROI) ?? 0,
          MoyenneROE = p.Simulations.Average(s =>(float?)s.Resultat.ROE) ?? 0,
          MoyenneROA = p.Simulations.Average(s =>(float?)s.Resultat.ROA) ?? 0
        }).ToList();

            ViewBag.AnalyseParProduit = analyses;
            return View();
}

    }
}

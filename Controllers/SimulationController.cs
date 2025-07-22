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

            return View(simulation);
        }
    }
}

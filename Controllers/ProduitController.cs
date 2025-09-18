using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutilRentabilite.Data;
using OutilRentabilite.Models;

namespace OutilRentabilite.Controllers
{
    public class ProduitController : Controller
    {
        private readonly AppDbContext _context;

        public ProduitController(AppDbContext context)
        {
            _context = context;
        }

        // Liste des produits
        public IActionResult ListProduit()
        {
            var produits = _context.ProduitsFinanciers.ToList();
            return View(produits);
        }

        // Ajouter un produit (GET)
        public IActionResult Create()
        {
            return View();
        }

        // Ajouter un produit (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(ProduitFinancier produit)
        {
            if (ModelState.IsValid)
            {
                _context.ProduitsFinanciers.Add(produit);
                _context.SaveChanges();
                return RedirectToAction(nameof(ListProduit));
            }
            return View(produit);
        }

        // Modifier un produit (GET)
        public IActionResult Edit(int id)
        {
            var produit = _context.ProduitsFinanciers.Find(id);
            if (produit == null) return NotFound();
            return View(produit);
        }

        // Modifier un produit (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(ProduitFinancier produit)
        {
            if (ModelState.IsValid)
            {
                _context.ProduitsFinanciers.Update(produit);
                _context.SaveChanges();
                return RedirectToAction(nameof(ListProduit));
            }
            return View(produit);
        }

        // Supprimer un produit
        public IActionResult Delete(int id)
        {
            var produit = _context.ProduitsFinanciers.Find(id);
            if (produit != null)
            {
                _context.ProduitsFinanciers.Remove(produit);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(ListProduit));
        }
    }
}

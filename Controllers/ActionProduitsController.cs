using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutilRentabilite.Data;
using OutilRentabilite.Models;

namespace OutilRentabilite.Controllers;

public class ActionProduitsController : Controller
{
    private readonly AppDbContext _context;

    public ActionProduitsController(AppDbContext context)
    {
        _context = context;
    }

    public IActionResult Index(int produitId)
    {
        var actions = _context.ActionsProduits
             .Include(a => a.Employe)
             .Include(a => a.TypeAction)
             .Where(a => a.ProduitFinancierId == produitId)
             .ToList();

        ViewBag.Produit = _context.ProduitsFinanciers.Find(produitId);
        return View(actions);
    }

    public IActionResult Create(int produitId)
    {
        ViewBag.Produit = produitId;
        ViewBag.Employes = _context.Employes.ToList();
        ViewBag.TypeActions = _context.TypeActions.ToList();

        return View(new ActionProduit { ProduitFinancierId = produitId });
    }

    [HttpPost]
    public IActionResult Create(ActionProduit action)
    {
        if (ModelState.IsValid)
        {
            _context.ActionsProduits.Add(action);
            _context.SaveChanges();
            return RedirectToAction("Index", new { produitId = action.ProduitFinancierId });
        }
        return View(action);
    }
}
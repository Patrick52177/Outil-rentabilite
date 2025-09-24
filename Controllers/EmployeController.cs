using Microsoft.AspNetCore.Mvc;
using OutilRentabilite.Data;
using OutilRentabilite.Models;

namespace OutilRentabilite.Controllers
{
    public class EmployeController : Controller
    {
        private readonly AppDbContext _context;

        public EmployeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult EditAll()
        {
            var employes = _context.Employes.ToList();
            return View(employes);
        }
        [HttpPost]
        public IActionResult EditAll(List<Employe> employes)
        {
            if (ModelState.IsValid)
            {
                foreach (var emp in employes)
                {
                    _context.Update(emp);
                }
                _context.SaveChanges();
                TempData["Message"] = "Paramètre employés mis à jour avec succés";
                return RedirectToAction("EditAll");
            }
            return View(employes);
        }
           
        

        public IActionResult Details(int id)
        {
            var employe = _context.Employes.FirstOrDefault(e => e.Id == id);
            if (employe == null) return NotFound();
            return View(employe);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Employe employe)
        {
            if (ModelState.IsValid)
            {
                _context.Employes.Add(employe);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(employe);
        }

        public IActionResult Edit(int id)
        {
            var employe = _context.Employes.Find(id);
            if (employe == null) return NotFound();
            return View(employe);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Employe employe)
        {
            if (ModelState.IsValid)
            {
                _context.Employes.Update(employe);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(employe);
        }

        public IActionResult Delete(int id)
        {
            var employe = _context.Employes.Find(id);
            if (employe == null) return NotFound();
            return View(employe);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var employe = _context.Employes.Find(id);
            if (employe != null)
            {
                _context.Employes.Remove(employe);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}

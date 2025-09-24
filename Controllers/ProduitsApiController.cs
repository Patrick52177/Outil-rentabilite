using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutilRentabilite.Data;
using OutilRentabilite.Models;

namespace OutilRentabilite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProduitsApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProduitsApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProduitsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProduitFinancier>>> GetProduits()
        {
            return await _context.ProduitsFinanciers.ToListAsync();
        }

        // GET: api/ProduitsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProduitFinancier>> GetProduit(int id)
        {
            var produit = await _context.ProduitsFinanciers.FindAsync(id);
            if (produit == null) return NotFound();
            return produit;
        }

        // POST: api/ProduitsApi
        [HttpPost]
        public async Task<ActionResult<ProduitFinancier>> CreateProduit(ProduitFinancier produit)
        {
            _context.ProduitsFinanciers.Add(produit);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduit), new { id = produit.Id }, produit);
        }

        // PUT: api/ProduitsApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduit(int id, ProduitFinancier produit)
        {
            if (id != produit.Id) return BadRequest();

            _context.Entry(produit).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ProduitsFinanciers.Any(p => p.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/ProduitsApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduit(int id)
        {
            var produit = await _context.ProduitsFinanciers.FindAsync(id);
            if (produit == null) return NotFound();

            _context.ProduitsFinanciers.Remove(produit);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

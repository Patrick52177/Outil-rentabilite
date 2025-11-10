using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutilRentabilite.Data;
using OutilRentabilite.Models;

namespace OutilRentabilite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TauxMarcheApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TauxMarcheApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/TauxMarcheApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TauxMarche>>> GetTaux()
        {
            return await _context.TauxMarches
                .OrderByDescending(t => t.DateEnregistrement)
                .ToListAsync();
        }

        // POST api/TauxMarcheApi
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TauxMarche taux)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            taux.DateEnregistrement = DateTime.Now;
            _context.TauxMarches.Add(taux);
            await _context.SaveChangesAsync();

            // ✅ Retourner l'ID créé
            return Ok(new { 
                message = "Taux enregistrés avec succès.",
                id = taux.Id
            });
        }

        // PUT api/TauxMarcheApi/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TauxMarche taux)
        {
            if (id != taux.Id) return BadRequest();

            _context.Entry(taux).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Taux mis à jour avec succès." });
        }

        // GET api/TauxMarcheApi/{id}/calculs
        [HttpGet("{id}/calculs")]
        public async Task<IActionResult> GetCalculs(int id)
        {
            var taux = await _context.TauxMarches.FindAsync(id);
            if (taux == null) return NotFound();

            decimal empruntJour = taux.TauxPlacementJourLeJour + taux.Marge;
            decimal emprunt30 = taux.BTA30 + taux.Marge;
            decimal emprunt90 = taux.BTA90 + taux.Marge;
            decimal emprunt180 = taux.BTA180 + taux.Marge;
            decimal emprunt360 = taux.BTA360 + taux.Marge;

            // ✅ Formule corrigée : (emprunt - tauxPlacement) * réserveObligatoire
            decimal Calc(decimal emprunt, decimal tauxPlacement)
                => (emprunt - tauxPlacement) * taux.ReserveObligatoire;

            var resultats = new
            {
                Emprunts = new
                {
                    Jour = empruntJour,
                    J30 = emprunt30,
                    J90 = emprunt90,
                    J180 = emprunt180,
                    J360 = emprunt360
                },
                Resultats = new
                {
                    Jour = Calc(empruntJour, taux.TauxPlacementJourLeJour),
                    J30 = Calc(emprunt30, taux.BTA30),
                    J90 = Calc(emprunt90, taux.BTA90),
                    J180 = Calc(emprunt180, taux.BTA180),
                    J360 = Calc(emprunt360, taux.BTA360)
                }
            };

            return Ok(resultats);
        }
    }
}
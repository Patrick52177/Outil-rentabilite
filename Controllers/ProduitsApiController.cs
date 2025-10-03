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
        public async Task<ActionResult<ProduitFinancier>> GetProduitById(int id)
        {
            var produit = await _context.ProduitsFinanciers.FindAsync(id);
            if (produit == null) return NotFound();
            return produit;
        }

        // POST: api/ProduitsApi
        [HttpPost]
        public async Task<ActionResult<ProduitFinancier>> CreateProduit([FromBody] ProduitFinancier produit)
        {
          //  if (!ModelState.IsValid) return BadRequest(ModelState);
            //Ajout du produit
            try
            {
                _context.ProduitsFinanciers.Add(produit);
                await _context.SaveChangesAsync();


                //Récuperer les types d'actions fixes 
                var typeActions = await _context.TypeActions.ToListAsync();
                var employes = await _context.Employes.ToListAsync();
                //Créer automatiquement les actions liées au produit
                foreach (var typeAction in typeActions)
                {


                    var actionProduit = new ActionProduit
                    {
                        ProduitFinancierId = produit.Id,
                        TypeActionId = typeAction.Id,
                        EmployeId = (int)(employes.FirstOrDefault()?.Id),
                        MinutesParAction = 0,
                        NombreActions = 0
                    };

                    _context.ActionsProduits.Add(actionProduit);
                }
                //ajouter paramètre base 
                var paramGen = new ParametresGenerauxProduit
                {
                    ProduitFinancierId = produit.Id,
                    LivretPa = 0,
                    Bordereau = 0,
                    Communication = 0,
                    Informatique = 0
                };
                _context.ParametresGenerauxProduits.Add(paramGen);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProduitById), new { id = produit.Id }, produit);
            }
            catch (Exception ex)
            {
                return StatusCode(500,$"Erreur interne :{ex.Message}");
            }
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

        //GET api/ProduitsApi/5
        [HttpGet("{id}/actions")]
        public async Task<IActionResult> GetActionProduit(int id)
        {
            var produit = await _context.ProduitsFinanciers.Include(p => p.Actions)
            .ThenInclude(a => a.TypeAction).Include(p => p.Actions)
            .ThenInclude(p => p.Employe).Include(p =>p.ParametresGenerauxProduit).AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

            if (produit == null) return NotFound();

            return Ok(produit);
        }

        //Put api/produits/actions/{id}
        [HttpPut("actions/{id}")]
        public async Task<IActionResult> UpdateActionProduit(int id, [FromBody] ActionProduit payload)
        {
            var existing = await _context.ActionsProduits.Include(a => a.Employe)
            .FirstOrDefaultAsync(a => a.Id == id);

            if (existing == null) return NotFound();
            existing.NombreActions = payload.NombreActions;
            existing.MinutesParAction = payload.MinutesParAction;
            await _context.SaveChangesAsync();
            return Ok(existing);
        }
           //PUT api/produits/{id}/parametres-generaux
        [HttpPut("{id}/parametres-generaux")]
        public async Task<IActionResult> UpdateParametresGeneraux(int id, [FromBody] ParametresGenerauxProduit payload)
        {
            var param = await _context.ParametresGenerauxProduits.FirstOrDefaultAsync(p => p.ProduitFinancierId == id);

            if (param == null) return NotFound();

            param.Bordereau = payload.Bordereau;
            param.Communication = payload.Communication;
            param.LivretPa = payload.LivretPa;
            param.Informatique = payload.Informatique;

            await _context.SaveChangesAsync();
            return Ok(param);
        }
        

        //GET api/produits/{id}/cout-partiel
        [HttpGet("{id}/cout-partiel")]
        public async Task<IActionResult> GetCoutUnitairePartiel(int id)
        {
            var produit = await _context.ProduitsFinanciers.Include(p => p.Actions)
            .ThenInclude(a => a.Employe).Include(p => p.ParametresGenerauxProduit).AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

            if (produit == null) return NotFound();
            var coutActions = produit.Actions.Sum(a => (a.NombreActions * a.MinutesParAction * (a.Employe?.CoutParMinute)));

            var coutChargesDirectes = (produit.ParametresGenerauxProduit?.Informatique ?? 0) + (produit.ParametresGenerauxProduit?.LivretPa ?? 0)
            + (produit.ParametresGenerauxProduit?.Bordereau ?? 0) + (produit.ParametresGenerauxProduit?.Communication ?? 0);

            decimal coutPartiel = (decimal)coutActions + (decimal)coutChargesDirectes;
            return Ok(new
            {
                ProduitId = produit.Id,
                CoutActions = coutActions,
                FraisGeneraux = coutChargesDirectes,
                CoutUnitairePartiel = coutPartiel
            });
        }
     
    }
}

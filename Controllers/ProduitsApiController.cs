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

        // 🔹 GET: api/ProduitsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProduitFinancier>>> GetProduits()
        {
            return await _context.ProduitsFinanciers
                .AsNoTracking()
                .ToListAsync();
        }
        // 🔹 POST: api/ProduitsApi
        [HttpPost]
        public async Task<ActionResult<ProduitFinancier>> CreateProduit([FromBody] ProduitFinancier produit)
        {
            try
            {
                _context.ProduitsFinanciers.Add(produit);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProduitDetails), new { id = produit.Id }, produit);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne : {ex.Message}");
            }
        }

        // 🔹 PUT: api/ProduitsApi/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduit(int id, [FromBody] ProduitFinancier produit)
        {
            if (id != produit.Id)
                return BadRequest();

            _context.Entry(produit).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        //Delete : produit
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduit(int id)
        {
            var produit = await _context.ProduitsFinanciers.FindAsync(id);
            if (produit == null) return NotFound();

            _context.ProduitsFinanciers.Remove(produit);
            await _context.SaveChangesAsync();
            return NoContent();



        }

        // 🔹 Initialiser les actions par défaut
        [HttpPost("{id}/actions/init")]
        public async Task<IActionResult> InitActions(int id)
        {
            var produit = await _context.ProduitsFinanciers.Include(p => p.Actions).FirstOrDefaultAsync(p => p.Id == id);
            if (produit == null) return NotFound("Produit non trouvé");

            if (produit.Actions != null && produit.Actions.Any())
                return Ok(produit.Actions);
            //Si les actions existent déjà initialisée pour ce produit.

            var employes = await _context.Employes.ToListAsync();
            int? GetEmployeId(string role)
            {
                return employes.FirstOrDefault(e => e.Nom.Contains(role, StringComparison.OrdinalIgnoreCase))?.Id;
            }

            var actions = new List<ActionProduit>();

            if (produit.TypeProduit.Equals("Épargne", StringComparison.OrdinalIgnoreCase))
            {
                actions.Add(new ActionProduit
                {
                    Nom = "Ouverture",
                    EmployeId = 3,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Clotûre",
                    EmployeId = 3,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Tenue",
                    EmployeId = 4,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Transaction en espèce",
                    EmployeId = 4,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Transaction en scripturales",
                    EmployeId = 4,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
            }
            else if (produit.TypeProduit.Equals("Crédit", StringComparison.OrdinalIgnoreCase))
            {
                actions.Add(new ActionProduit
                {
                    Nom = "Ouverture",
                    EmployeId = 1,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Clotûre",
                    EmployeId = 3,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Tenue",
                    EmployeId = 4,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Transaction en espèce",
                    EmployeId = 4,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
                actions.Add(new ActionProduit
                {
                    Nom = "Transaction en scripturales",
                    EmployeId = 4,
                    NombreActions = 0,
                    MinutesParAction = 0

                });
            }
            foreach (var a in actions)
            {
                a.ProduitFinancierId = produit.Id;

                _context.ActionsProduits.Add(a);
            }

            await _context.SaveChangesAsync();
            return Ok(actions);
        }

        // 🔹 GET: api/ProduitsApi/{id}/details
        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetProduitDetails(int id)
        {
            var produit = await _context.ProduitsFinanciers
                .Include(p => p.Actions)
                    .ThenInclude(a => a.Employe)
                .Include(p => p.ParametresGenerauxProduit)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (produit == null)
                return NotFound();

            var dto = new
            {
                produit.Id,
                produit.Nom,
                produit.TypeProduit,
                Actions = produit.Actions.Select(a => new
                {
                    a.Id,
                    a.Nom,
                    a.MinutesParAction,
                    a.NombreActions,
                    Employe = new
                    {
                        a.Employe.Id,
                        a.Employe.Nom,
                        a.Employe.CoutParMinute
                    }
                })
            };


            return Ok(produit);
        }



        // 🔹 PUT api/ProduitsApi/actions/{id}
        [HttpPut("actions/{id}")]
        public async Task<IActionResult> UpdateActionProduit(int id, [FromBody] ActionProduit payload)
        {
            var action = await _context.ActionsProduits.FindAsync(id);
            if (action == null) return NotFound();

            action.NombreActions = payload.NombreActions;
            action.MinutesParAction = payload.MinutesParAction;
            action.EmployeId = payload.EmployeId;

            await _context.SaveChangesAsync();
            return Ok(action);
        }

        // 🔹 PUT api/ProduitsApi/{id}/parametres-generaux
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

        // 🔹 GET api/ProduitsApi/{id}/cout-partiel
        [HttpGet("{id}/cout-partiel")]
        public async Task<IActionResult> GetCoutUnitairePartiel(int id)
        {
            var produit = await _context.ProduitsFinanciers
                .Include(p => p.Actions)
                    .ThenInclude(a => a.Employe)
                .Include(p => p.ParametresGenerauxProduit)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (produit == null) return NotFound();

            decimal coutActions = produit.Actions.Sum(a =>
                (a.NombreActions * a.MinutesParAction * (a.Employe?.CoutParMinute ?? 0m))
            );

            decimal coutCharges = (produit.ParametresGenerauxProduit?.LivretPa ?? 0)
                + (produit.ParametresGenerauxProduit?.Bordereau ?? 0)
                + (produit.ParametresGenerauxProduit?.Informatique ?? 0)
                + (produit.ParametresGenerauxProduit?.Communication ?? 0);

            return Ok(new
            {
                ProduitId = produit.Id,
                CoutActions = coutActions,
                CoutCharges = coutCharges,
                CoutUnitairePartiel = coutActions + coutCharges
            });
        }

        //Modifier l'employe appartient à une action
        [HttpPut("actions/{id}/employe")]
        public async Task<IActionResult> UpdateActinEmploye(int id, [FromBody] dynamic body)
        {
            int employeId = (int)body.employeId;
            var action = await _context.ActionsProduits.Include(a =>a.Employe).FirstOrDefaultAsync(a=>a.Id==id);
            if (action == null) return NotFound();

            action.EmployeId = employeId;
            await _context.SaveChangesAsync();
            action.Employe = await _context.Employes.FindAsync(id);

            return Ok(action);
        } 

        [HttpPost("{id}/resultats")]
        public async Task<IActionResult> EnregistrerResultat(int id, [FromBody] ResultatCalcul resultat)
        {
            var produit = await _context.ProduitsFinanciers.FindAsync(id);

            if(produit == null) return NotFound("Produit non trouvé.");

            resultat.ProduitFinancierId = id;
            resultat.DateCalcul = DateTime.Now;

            _context.ResultatCalculs.Add(resultat);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Résultat enregistré avec succés"});
        }

    }
}
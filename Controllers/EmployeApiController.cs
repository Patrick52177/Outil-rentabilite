using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OutilRentabilite.Data;
using OutilRentabilite.Models;

namespace OutilRentabilite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProduitsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employe>>> GetEmployes()
        {
            return await _context.Employes.ToListAsync();
        }

        // GET: api/ProduitsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employe>> GetEmploye(int id)
        {
            var employe = await _context.Employes.FindAsync(id);
            if (employe == null) return NotFound();
            return employe;
        }


        // PUT: api/ProduitsApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employe employe)
        {
            if (id != employe.Id) return BadRequest();

            _context.Entry(employe).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Employes.Any(p => p.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
    }
}

using EnterpriseOperations.API.Data;
using EnterpriseOperations.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseOperations.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LocationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
    {
        return await _context.Locations.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Location>> CreateLocation(Location location)
    {
        _context.Locations.Add(location);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetLocations),
            new { id = location.LocationID },
            location);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLocation(int id, Location location)
    {
    if (id != location.LocationID)
    {
        return BadRequest();
    }

    var existingLocation = await _context.Locations.FindAsync(id);

    if (existingLocation == null)
    {
        return NotFound();
    }

    existingLocation.LocationName = location.LocationName;

    await _context.SaveChangesAsync();

    return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLocation(int id)
    {   
    var location = await _context.Locations.FindAsync(id);

    if (location == null)
    {
        return NotFound();
    }

    _context.Locations.Remove(location);
    await _context.SaveChangesAsync();

    return NoContent();
    }
}
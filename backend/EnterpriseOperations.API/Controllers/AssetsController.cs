using EnterpriseOperations.API.Data;
using EnterpriseOperations.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseOperations.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public AssetsController(ApplicationDbContext context)
{
    _context = context;
}

[HttpGet]
public async Task<ActionResult<IEnumerable<Asset>>> GetAssets()
{
    return await _context.Assets.ToListAsync();
}

[HttpGet("{id}")]
public async Task<ActionResult<Asset>> GetAsset(int id)
{
    var asset = await _context.Assets.FindAsync(id);

    if (asset == null)
    {
        return NotFound();
    }

    return asset;
}

[HttpPut("{id}")]
public async Task<IActionResult> UpdateAsset(int id, Asset asset)
{
    if (id != asset.AssetID)
    {
        return BadRequest();
    }

    if (asset.PurchaseDate.HasValue)
    {
        asset.PurchaseDate = DateTime.SpecifyKind(
            asset.PurchaseDate.Value,
            DateTimeKind.Utc);
    }

    _context.Entry(asset).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!AssetExists(id))
        {
            return NotFound();
        }

        throw;
    }

    return NoContent();
}

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteAsset(int id)
{
    var asset = await _context.Assets.FindAsync(id);

    if (asset == null)
    {
        return NotFound();
    }

    _context.Assets.Remove(asset);
    await _context.SaveChangesAsync();

    return NoContent();
}
private bool AssetExists(int id)
{
    return _context.Assets.Any(e => e.AssetID == id);
}

[HttpPost]
public async Task<ActionResult<Asset>> CreateAsset(Asset asset)
{
    if (asset.PurchaseDate.HasValue)
{
    asset.PurchaseDate = DateTime.SpecifyKind(
        asset.PurchaseDate.Value,
        DateTimeKind.Utc);
}

    _context.Assets.Add(asset);
    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(GetAssets),
        new { id = asset.AssetID },
        asset);
}

}

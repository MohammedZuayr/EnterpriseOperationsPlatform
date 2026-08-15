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

using EnterpriseOperations.API.Data;
using EnterpriseOperations.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseOperations.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return await _context.Categories.ToListAsync();
    }


    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
    _context.Categories.Add(category);
    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(GetCategories),
        new { id = category.CategoryID },
        category);
    } 

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, Category category)
    {
    if (id != category.CategoryID)
    {
        return BadRequest();
    }

    var existingCategory = await _context.Categories.FindAsync(id);

    if (existingCategory == null)
    {
        return NotFound();
    }

    existingCategory.CategoryName = category.CategoryName;

    await _context.SaveChangesAsync();

    return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
    var category = await _context.Categories.FindAsync(id);

    if (category == null)
    {
        return NotFound();
    }

    _context.Categories.Remove(category);
    await _context.SaveChangesAsync();

    return NoContent();
    }

}
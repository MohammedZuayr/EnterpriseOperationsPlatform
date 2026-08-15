using EnterpriseOperations.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseOperations.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    public DbSet<Asset> Assets {get; set;}
    public DbSet<Category> Categories {get; set;}
    public DbSet<Employee> Employees {get; set;}
    public DbSet<Location> Locations {get; set;}

}
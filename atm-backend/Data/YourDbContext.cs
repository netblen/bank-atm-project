using Microsoft.EntityFrameworkCore;
using atm_backend.Data.Models;

namespace atm_backend.Data  // You can adjust the namespace to match your project
{
    // Data/YourDbContext.cs
    public class YourDbContext : DbContext
    {
        public YourDbContext(DbContextOptions<YourDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
    }

}


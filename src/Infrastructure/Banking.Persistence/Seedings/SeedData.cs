using Banking.Common.Constants;
using Banking.Core.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace Banking.Persistence.Seedings
{
    public static class SeedData
    {
        public static void SeedRoles(this ModelBuilder builder)
        {
            builder.Entity<Role>().HasData(
                     new Role { Id = "admin", Name = "Admin", NormalizedName = RoleConstant.Admin },
                     new Role { Id = "user", Name = "User", NormalizedName = RoleConstant.User }
               );
        }
    }
}

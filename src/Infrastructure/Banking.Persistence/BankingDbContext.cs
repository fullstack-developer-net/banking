using Banking.Common.Constants;
using Banking.Core.Entities;
using Banking.Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Banking.Persistence
{
    public class BankingDbContext(DbContextOptions<BankingDbContext> options) : IdentityDbContext<User, Role, string>(options)
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            SetupEntityRelationships(builder);
            SeedData(builder);

        }

        private static void SeedData(ModelBuilder builder)
        {
            builder.Entity<Role>().HasData(
                new Role { Id = "admin", Name = "Admin", NormalizedName = RoleConstant.Admin },
                new Role { Id = "user", Name = "User", NormalizedName = RoleConstant.User }
            );
        }

        private static void SetupEntityRelationships(ModelBuilder builder)
        {
            builder.Entity<User>().ToTable("Users").Property(x=>x.Id).ValueGeneratedOnAdd();
            builder.Entity<Role>().ToTable("Roles");
            builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");


            // Relationship configurations
            builder.Entity<Account>().ToTable("Accounts").HasKey(a => a.AccountId);
            builder.Entity<Account>()
                .HasOne(a => a.User)
                .WithOne(x => x.Account)
                .HasForeignKey<Account>(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Specify precision and scale for decimal properties
            builder.Entity<Account>()
                .Property(a => a.Balance)
                .HasPrecision(18, 2);

            builder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);

            builder.Entity<Transaction>()
                .HasOne(t => t.FromAccount)
                .WithMany()
                .HasForeignKey(t => t.FromAccountId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Transaction>()
                .HasOne(t => t.ToAccount)
                .WithMany()
                .HasForeignKey(t => t.ToAccountId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public override int SaveChanges()
        {
            var result = base.SaveChanges();
            return result;
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {

            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }



    }
}

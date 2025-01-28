using Banking.Domain.Entities;
using Banking.Domain.Entities.Identity;
using Banking.Domain.Helpers;
using Banking.Persistence.Seedings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Banking.Persistence
{
    public class BankingDbContext(DbContextOptions<BankingDbContext> options) : IdentityDbContext<User>(options)
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            SetupEntityRelationships(builder);
            SeedData(builder);

        }

        private void SeedData(ModelBuilder builder)
        {
            builder.SeedRoles();
        }

        private static void SetupEntityRelationships(ModelBuilder builder)
        {
            builder.Entity<User>(b =>
            {
                b.ToTable("Users");
            });
            builder.Entity<IdentityRole>(b =>
            {
                b.ToTable("Roles");
            });

            builder.Entity<IdentityUserRole<string>>(b =>
            {
                b.ToTable("UserRoles");
            });

            builder.Entity<IdentityUserClaim<string>>(b =>
            {
                b.ToTable("UserClaims");
            });

            builder.Entity<IdentityUserLogin<string>>(b =>
            {
                b.ToTable("UserLogins");
            });

            builder.Entity<IdentityRoleClaim<string>>(b =>
            {
                b.ToTable("RoleClaims");
            });

            builder.Entity<IdentityUserToken<string>>(b =>
            {
                b.ToTable("UserTokens");
            });

            // Relationship configurations
            builder.Entity<Account>()
                .HasOne(a => a.User)
                .WithOne(u => u.Account)
                .HasPrincipalKey<User>(u => u.Id)
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
        private void UpdateTransactionTime()
        {
            if (!ChangeTracker.Entries<Transaction>().Any(e => e.State == EntityState.Added)) return;

            var newTransactions = ChangeTracker.Entries<Transaction>()
                .Where(e => e.State == EntityState.Added)
                .Select(e => e.Entity);
            foreach (var transaction in newTransactions)
            {
                transaction.TransactionTime = DateTime.UtcNow;
            }
        }
        private void UpdateBankAccountNumbers()
        {
            if (!ChangeTracker.Entries<Account>().Any(e => e.State == EntityState.Added)) return;

            var newAccounts = ChangeTracker.Entries<Account>()
                .Where(e => e.State == EntityState.Added)
                .Select(e => e.Entity);

            foreach (var account in newAccounts)
            {
                account.AccountNumber = CommonHelper.GenerateAccountNumber(account.AccountId);
            }
        }
        public override int SaveChanges()
        {
            PrepareEntitiesForSave();
            return base.SaveChanges();
        }

        private void PrepareEntitiesForSave()
        {
            UpdateBankAccountNumbers();
            UpdateTransactionTime();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            PrepareEntitiesForSave();
            return base.SaveChangesAsync(cancellationToken);
        }

    }
}

using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Banking.Domain.Entities.Identity
{
    [Table("Users")]
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public bool IsActive { get; set; }
        public Account Account { get; set; }
        public string TemporaryPassword { get; set; }
        public ICollection<IdentityUserToken<string>> UserTokens { get; set; }
        public ICollection<IdentityUserRole<string>> UserRoles { get; set; }

    }
}

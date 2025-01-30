using Microsoft.AspNetCore.Identity;

namespace Banking.Core.Entities.Identity
{
    public class User : IdentityUser<string>
    {
        public string FullName { get; set; }
        public bool IsActive { get; set; }
        public Account Account { get; set; }
        public string TemporaryPassword { get; set; }
        public string? RefreshToken{ get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public IEnumerable<Role> Roles { get; set; }
    }
}

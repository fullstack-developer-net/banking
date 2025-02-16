using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace Banking.Core.Entities.Identity
{
    public class User : IdentityUser<string>
    {
        public string FullName { get; set; }
        public bool IsActive { get; set; }
        
        [JsonIgnore]
        public Account Account { get; set; }
        
        public string TemporaryPassword { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public IEnumerable<Role> Roles { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? ModifiedBy { get; set; }

    }
}

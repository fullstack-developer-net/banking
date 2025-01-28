using System.Security.Claims;

namespace Banking.Domain.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        bool ValidateToken(string token, out ClaimsPrincipal claimsPrincipal);  

    }
}

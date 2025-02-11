using System.ComponentModel.DataAnnotations;

namespace Banking.Application.Dtos
{
    public class GetUserDto
    {
        public string FullName { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        
    }
} 
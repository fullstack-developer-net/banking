﻿using System.ComponentModel.DataAnnotations;

namespace Banking.Application.Dtos
{
    public class UserDto
    {
        public string? UserId { get; set; }
        public string FullName { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
 
    public class CreateUserDto
    {
        [Required]
        public string FullName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }


}

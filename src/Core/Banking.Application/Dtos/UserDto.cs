namespace Banking.Application.Dtos
{
    public class UserDto
    {
        public string? UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
    }

    public class CreateUserDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
    }


}

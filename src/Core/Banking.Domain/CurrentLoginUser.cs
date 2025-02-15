using Banking.Core.Entities;
using Banking.Core.Entities.Identity;

namespace Banking.Core;

public class CurrentLoginUser 
{
     public List<string>? Roles { get; set; }
    
    public Account? Account { get; set; }
    public User? User { get; set; }
}
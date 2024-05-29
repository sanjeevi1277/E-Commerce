using System.ComponentModel.DataAnnotations;

namespace ProductsManagerAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; } 
        public UserRole Role { get; set; } // Single user role

        public enum UserRole // Nested enum within User class
        {
            User,
            Admin
        }
    }
}

using Microsoft.AspNetCore.Identity;

namespace ProductsManagerAPI.Auth
{
    public class ApplicationUser:IdentityUser
    {
        public bool isRoleVerified { get; set; } = false;
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsManagerAPI.Auth;

namespace ProductsManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserVerifyController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;

        public UserVerifyController(ProductContext context, 
            UserManager<ApplicationUser> userManager
)
        {
            _userManager = userManager;
        }


        [HttpPut]
        public async Task<IActionResult> VerifyUserAccount(string? Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);

            if (user != null)
            {
                user.isRoleVerified = true;
            }
            _userManager.UpdateAsync(user);
            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }
    }
}
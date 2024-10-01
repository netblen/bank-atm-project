using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using  atm_backend.Data;
using atm_backend.Data.Models;

namespace atm_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly YourDbContext _context;

        public UsersController(YourDbContext context)
        {
            _context = context;
        }

        // POST api/users/signup
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Return model validation errors
            }

            // Check if a user with the same email already exists
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            // Add new user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // You can return a token or a simple success message
            return Ok(new { message = "User signed up successfully" });
        }


        // POST api/users/signin
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null || user.Password != request.Password) // Use hashed passwords in production
            {
                return Unauthorized();
            }

            // Generate token or do something else for successful sign-in
            return Ok(new { Message = "Sign-in successful" });
        }
    }
}

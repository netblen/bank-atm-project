using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using atm_backend.Data;
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
            return Ok(new { rol = user.rol.TrimEnd() });
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserWithAccounts(int userId)
        {
            var user = await _context.Users
                //.Include(u => u.Accounts)  // Include Accounts in the result
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);  // This will return the user along with their accounts
        }
        
        [HttpGet("getUserInfo")]
        public async Task<IActionResult> GetUserInfo(string email)
        {
            var result = await (from user in _context.Users
                                where user.Email == email
                                join savings in _context.SavingsAccounts on user.Id equals savings.user_id into savingsGroup
                                from savings in savingsGroup.DefaultIfEmpty()
                                join checking in _context.CheckingsAccounts on user.Id equals checking.user_id into checkingGroup
                                from checking in checkingGroup.DefaultIfEmpty()
                                select new
                                {
                                    Name = user.first_name,
                                    TotalBalance = (savings != null ? savings.Balance : 0) + (checking != null ? checking.Balance : 0),
                                    SavingsBalance = savings != null ? savings.Balance : 0,
                                    CheckingBalance = checking != null ? checking.Balance : 0
                                }).ToListAsync();

            if (!result.Any()) // Verificar si no se encontró el usuario
            {
                return NotFound(); // Retornar 404 si el usuario no existe
            }

            return Ok(result);
        }

        [HttpGet("savingstransactionsByEmail")]
        public async Task<IActionResult> SavingsGetUserTransactionsByEmail(string email)
        {
            // Busca el usuario por correo electrónico
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null) // Verifica si no se encontró el usuario
            {
                return NotFound("User not found.");
            }

            // Obtiene las transacciones asociadas al usuario
            var transactions = await _context.SavingsTransactions
                .Where(t => t.user_id == user.Id) // Filtra por el ID del usuario
                     .OrderByDescending(t => t.Id) 
       
                .ToListAsync();

            if (!transactions.Any())
            {
                return NotFound("No transactions found.");
            }

            return Ok(transactions);
        }

        [HttpGet("checkingstransactionsByEmail")]
        public async Task<IActionResult> CheckingGetUserTransactionsByEmail(string email)
        {
            // Busca el usuario por correo electrónico
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null) // Verifica si no se encontró el usuario
            {
                return NotFound("User not found.");
            }

            // Obtiene las transacciones asociadas al usuario
            var transactions = await _context.CheckingTransactions
                .Where(t => t.user_id == user.Id) // Filtra por el ID del usuario
                .OrderByDescending(t => t.Id) 
               
                .ToListAsync();

            if (!transactions.Any())
            {
                return NotFound("No transactions found.");
            }

            return Ok(transactions);
        }

        [HttpGet("checkingbalance")]
        public async Task<IActionResult> GetCheckingBalance(string email)
        {
             var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
              if (user == null) // Verifica si no se encontró el usuario
            {
                return NotFound("User not found.");
            }
            var balance = await _context.CheckingsAccounts
                .Where(t => t.user_id == user.Id)
                .SumAsync(t => t.Balance); // Sumar todos los montos

            return Ok(new { Balance = balance });
        }

        [HttpGet("savingsbalance")]
        public async Task<IActionResult> GetSavingsBalance(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
              if (user == null) // Verifica si no se encontró el usuario
            {
                return NotFound("User not found.");
            }
            var balance = await _context.SavingsAccounts
                .Where(t => t.user_id == user.Id)
                .SumAsync(t => t.Balance); // Sumar todos los montos

            return Ok(new { Balance = balance });
        }
    }
}
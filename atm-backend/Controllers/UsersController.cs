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
                return BadRequest(ModelState);
            }
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "User with this email already exists" });
            }
            if (user.Profession != "employed" && user.Profession != "student" && user.Profession != "unemployed")
            {
                return BadRequest("Invalid profession value. Allowed values are 'employed', 'student', or 'unemployed'.");
            }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var checkingAccount = new CheckingsAccount
                {
                    user_id = user.Id,
                    Balance = 0,
                    date_opened = DateTime.Now
                };
                var savingsAccount = new SavingsAccount
                {
                     user_id = user.Id,
                    Balance = 50,
                    date_opened = DateTime.Now
                };
                _context.CheckingsAccounts.Add(checkingAccount);
                _context.SavingsAccounts.Add(savingsAccount);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User signed up successfully" });
        }

        // POST api/users/signin
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null || user.Password != request.Password) 
            {
                return Unauthorized();
            }
            return Ok(new { rol = user.rol.TrimEnd() });
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserWithAccounts(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
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
            if (!result.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        //Savings
        [HttpGet("savingstransactionsByEmail")]
        public async Task<IActionResult> SavingsGetUserTransactionsByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var transactions = await _context.SavingsTransactions
                .Where(t => t.user_id == user.Id)
                .OrderByDescending(t => t.Id) 
                .ToListAsync();
            if (!transactions.Any())
            {
                return NotFound("No transactions found.");
            }
            return Ok(transactions);
        }
        [HttpGet("savingsbalance")]
        public async Task<IActionResult> GetSavingsBalance(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
              if (user == null) 
            {
                return NotFound("User not found.");
            }
            var balance = await _context.SavingsAccounts
                .Where(t => t.user_id == user.Id)
                .SumAsync(t => t.Balance);

            return Ok(new { Balance = balance });
        }
        [HttpGet("savingsTransactionCount")]
        public async Task<IActionResult> GetSavingsTransactionCount(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            var transactionCount = await _context.SavingsTransactions
                .Where(t => t.user_id == user.Id && t.TransactionDate >= startOfMonth && t.TransactionDate <= endOfMonth)
                .CountAsync();

            return Ok(new { Count = transactionCount });
        }

        //Checking
        [HttpGet("checkingstransactionsByEmail")]
        public async Task<IActionResult> CheckingGetUserTransactionsByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var transactions = await _context.CheckingTransactions
                .Where(t => t.user_id == user.Id)
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

        //Admin Dashboard
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.Take(1000).ToListAsync();
            return Ok(users);
        }
        
        //User Activity Logs
        [HttpGet("UserActivityLogs")]
        public async Task<ActionResult<IEnumerable<UserActivityLogs>>> GetUserActivityLogs()
        {
            return await _context.UserActivityLogs.ToListAsync();
        }

        [HttpPut("mark-activity")]
        public IActionResult MarkActivity([FromBody] ActivityUpdateRequest request)
        {
            var activity = _context.UserActivityLogs.FirstOrDefault(a => a.Id == request.Id);
            if (activity == null)
            {
                return NotFound(new { title = "Activity not found" });
            }

            activity.IsRead = request.IsRead;
            _context.SaveChanges();

            return Ok(new { message = "Activity updated successfully" });
        }

        [HttpGet("recent-activity")]
        public IActionResult GetRecentActivity(string email)
        {
            var activities = _context.UserActivityLogs
                                    .Where(a => a.Email == email)
                                    .ToList();

            return Ok(activities);
        }

        //Delete user
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var checkingTransactions = await _context.CheckingTransactions
                        .Where(ct => ct.user_id == id)
                        .ToListAsync();
                    _context.CheckingTransactions.RemoveRange(checkingTransactions);
                    var checkingAccounts = await _context.CheckingsAccounts
                        .Where(ca => ca.user_id == id)
                        .ToListAsync();
                    _context.CheckingsAccounts.RemoveRange(checkingAccounts);
                    var savingsTransactions = await _context.SavingsTransactions
                        .Where(t => t.user_id == id)
                        .ToListAsync();
                    _context.SavingsTransactions.RemoveRange(savingsTransactions);
                    var savingsAccounts = await _context.SavingsAccounts
                        .Where(sa => sa.user_id == id)
                        .ToListAsync();
                    _context.SavingsAccounts.RemoveRange(savingsAccounts);
                    var user = await _context.Users.FindAsync(id);
                    if (user == null)
                    {
                        return NotFound();
                    }
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"Internal server error: {ex.Message}, Inner Exception: {ex.InnerException?.Message}");
                }
            }
            return NoContent();
        }

        //ForgotPassword
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.ContactInfo) || 
                string.IsNullOrEmpty(request.SecurityCode) || 
                string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            if (request.SecurityCode != "E2UY32") 
            {
                return BadRequest(new { message = "Invalid security code." });
            }
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.ContactInfo);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }
            user.Password = request.NewPassword;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Password reset successfully." });
        }
        //EditPassword
        [HttpPost("security-password")]
        public async Task<IActionResult> SecurityPassword([FromBody] ChangePassword request)
        {
            if (string.IsNullOrEmpty(request.Email) || // Cambiado de contactInfo a Email
                string.IsNullOrEmpty(request.SecurityQuestion) || 
                string.IsNullOrEmpty(request.SecurityAnswer) || 
                string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == request.Email); // Cambiado de contactInfo a Email

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Verificar la pregunta de seguridad
            if (user.security_question != request.SecurityQuestion || 
                user.security_answer != request.SecurityAnswer)
            {
                return BadRequest(new { message = "Invalid security question or answer." });
            }

            // Cambiar la contraseña
            user.Password = request.NewPassword;
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Password changed successfully." });
        }


        //UpdateUserAdmin
        [HttpPut("UpdateUserbyAdmin")]
        public async Task<IActionResult> UpdateUserbyAdmin(int id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest("User ID mismatch");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound("User not found");
            }
            existingUser.first_name = user.first_name;
            existingUser.last_name = user.last_name;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;
            existingUser.Telephone = user.Telephone;
            existingUser.City = user.City;
            existingUser.postal_code = user.postal_code;
            existingUser.Profession = user.Profession;
            existingUser.security_question = user.security_question;
            existingUser.security_answer = user.security_answer;
            existingUser.date_of_birth = user.date_of_birth;
            existingUser.rol = user.rol;
            try
            {
                await _context.SaveChangesAsync();
                return Ok("User updated successfully");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "Error updating user: " + ex.Message);
            }
        }
        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUserbyUser( [FromBody] UserUpdateDto userDto)
        {
            // Buscar el usuario por correo electrónico
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == userDto.Email);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            // Verificar la contraseña proporcionada
            if (!VerifyPassword(userDto.Password, user.Password))
            {
                return BadRequest(new { message = "Incorrect password" });
            }
            // Actualizar solo los campos permitidos
            user.City = userDto.City;
            user.postal_code = userDto.PostalCode;
            user.Profession = userDto.Profession;
            user.security_question = userDto.SecurityQuestion;
            user.security_answer = userDto.SecurityAnswer;
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", details = ex.Message });
            }
        }
        private bool VerifyPassword(string inputPassword, string storedPasswordHash)
        {
            return inputPassword == storedPasswordHash;
        }


        [HttpGet("details")]
        public async Task<IActionResult> GetUserDetails([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            var user = await _context.Users
                .Where(u => u.Email == email)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.first_name,
                    u.last_name,
                    u.Telephone,
                    u.City,
                    u.postal_code,
                    u.security_question,
                    u.security_answer,
                    u.Profession,
                    u.created_at,
                    u.date_of_birth,
                    u.rol
                })
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        [HttpPost("Appointments")]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {
            if (appointment == null || string.IsNullOrWhiteSpace(appointment.UserEmail) || string.IsNullOrWhiteSpace(appointment.Reason))
            {
                return BadRequest("Invalid appointment data.");
            }

            if (appointment.Reason.Length > 600)
            {
                return BadRequest("Reason must be less than 100 words.");
            }
            appointment.CreatedAt = DateTime.UtcNow;
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateAppointment), new { id = appointment.Id }, appointment);
        }

        //Feedback
        [HttpPost("Feedback")]
        public async Task<IActionResult> SubmitFeedback([FromBody] Feedback request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Comments))
            {
                return BadRequest("Invalid data.");
            }
            var feedback = new Feedback
            {
                Email = request.Email,
                Comments = request.Comments,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow
            };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return Ok(new { message = request.Type == "feedback" ? "Feedback received!" : "Issue reported!" });
        }

        //Rate
        [HttpPost("rate")]
        public async Task<IActionResult> RateCustomer([FromBody] CustomerFeedback feedback)
        {
            if (feedback == null || feedback.Rating < 1 || feedback.Rating > 5)
            {
                return BadRequest("Invalid feedback.");
            }
            _context.CustomerFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return Ok();
        }

        //
        [HttpPost("creategoal")]
        public async Task<IActionResult> CreateGoal([FromBody] FinancialGoal goal)
        {
            var user = await _context.Users.FindAsync(goal.user_id);
            if (user == null)
            {
                return NotFound($"User with ID {goal.user_id} not found.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (goal.target_amount <= 0)
            {
                return BadRequest("Target amount must be greater than zero.");
            }
            _context.FinancialGoals.Add(goal);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Financial goal created successfully.",
                data = goal
            });
        }
        //Financial Goals
        [HttpGet("financial-userId")]
        public async Task<IActionResult> GetGoals(int userId)
        {
            var goals = await _context.FinancialGoals
                .Where(g => g.user_id == userId)
                .ToListAsync();
            return Ok(goals);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(int id, [FromBody] FinancialGoal updatedGoal)
        {
            var goal = await _context.FinancialGoals.FindAsync(id);
            if (goal == null) return NotFound();
            goal.GoalName = updatedGoal.GoalName;
            goal.target_amount = updatedGoal.target_amount;
            goal.due_date = updatedGoal.due_date;
            await _context.SaveChangesAsync();
            return Ok(goal);
        }
        [HttpDelete("deletefinancial-id")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var goal = await _context.FinancialGoals.FindAsync(id);
            if (goal == null) return NotFound();
            _context.FinancialGoals.Remove(goal);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        //survey
        [HttpPost("survey-yes")]
        public async Task<IActionResult> SaveSurveyResponse(int userId, int satisfactionLevel, int usageFrequency, int locationConvenience, string frequentlyUsedServices, int transactionSpeedSatisfaction)
        {
            var surveyResponse = new SurveyResponse
            {
                user_id = userId,
                satisfaction_level = satisfactionLevel,
                usage_frequency = usageFrequency,
                location_convenience = locationConvenience,
                frequently_used_services = frequentlyUsedServices,
                transaction_speed_satisfaction = transactionSpeedSatisfaction,
                submitted_at = DateTime.Now
            };

            _context.SurveyResponses.Add(surveyResponse);
            await _context.SaveChangesAsync();

            return Ok("Survey response saved successfully.");
        }
        
    }
}
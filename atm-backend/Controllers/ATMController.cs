using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using atm_backend.Data;
using atm_backend.Data.Models;

[ApiController]
[Route("api/[controller]")]
public class ATMController : ControllerBase
{
    private readonly YourDbContext _context;

    public ATMController(YourDbContext context)
    {
        _context = context;
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactionHistory()
    {
        var transactions = await _context.Transactions.ToListAsync();
        return Ok(transactions);
    }

    [HttpPost("transferBetweenAccountsChecking")]
    public async Task<IActionResult> transferBetweenAccountsChecking([FromBody] TransferRequest request)
    {
        if (request.Amount <= 0)
        {
            return BadRequest("Invalid transfer amount.");
        }

        using (var transaction = await _context.Database.BeginTransactionAsync(CancellationToken.None))
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var checkingAccount = await _context.CheckingsAccounts.FirstOrDefaultAsync(u => u.user_id == user.Id);
                if (checkingAccount == null)
                {
                    return NotFound("Checking account not found.");
                }

                var savingsAccount = await _context.SavingsAccounts.FirstOrDefaultAsync(s => s.user_id == user.Id);
                if (savingsAccount == null)
                {
                    return NotFound("Savings account not found.");
                }

                var checkingTransaction = new CheckingTransactions
                {
                    user_id = user.Id,
                    checking_account_id = checkingAccount.checking_account_id,
                    TransactionDate = DateTime.Now,
                    Amount = request.Amount,
                    Description = request.description,
                    TransactionType = request.transaction_type
                };
                _context.CheckingTransactions.Add(checkingTransaction);
                await _context.SaveChangesAsync();

                checkingAccount.Balance -= request.Amount;
                _context.Entry(checkingAccount).Property(x => x.Balance).IsModified = true;
                await _context.SaveChangesAsync();

                var savingsTransaction = new SavingsTransaction
                {
                    user_id = user.Id,
                    savings_account_id = savingsAccount.savings_account_id,
                    TransactionDate = DateTime.Now,
                    Amount = request.Amount,
                    Description = "Transfer from Checking",
                    TransactionType = "Transfer"
                };
                _context.SavingsTransactions.Add(savingsTransaction);
                await _context.SaveChangesAsync();

                savingsAccount.Balance += request.Amount;
                _context.Entry(savingsAccount).Property(x => x.Balance).IsModified = true;
                await _context.SaveChangesAsync();

                var activityLog = new UserActivityLogs
                {
                    Email = request.Email,
                    ActivityType = request.transaction_type == "W" ? "Withdrawal" : "Deposit",
                    Amount = request.Amount,
                    ActivityDate = DateTime.UtcNow
                };
                _context.UserActivityLogs.Add(activityLog);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { Message = "Transfer successful." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }

                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }

    [HttpPost("ExecuteTransactionChecking")]
    public async Task<IActionResult> ExecuteTransactionChecking([FromBody] TransferRequest request)
    {
        if (request.Amount <= 0)
        {
            return BadRequest("Invalid transaction amount.");
        }

        using (var transaction = await _context.Database.BeginTransactionAsync(CancellationToken.None))
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var checkingAccount = await _context.CheckingsAccounts.FirstOrDefaultAsync(u => u.user_id == user.Id);
                if (checkingAccount == null)
                {
                    return NotFound("Checking account not found.");
                }

                var checkingTransaction = new CheckingTransactions
                {
                    user_id = user.Id,
                    checking_account_id = checkingAccount.checking_account_id,
                    TransactionDate = DateTime.Now,
                    Amount = request.Amount,
                    Description = request.description,
                    TransactionType = request.transaction_type
                };
                _context.CheckingTransactions.Add(checkingTransaction);
                await _context.SaveChangesAsync();

                if (request.transaction_type == "W" || request.transaction_type == "P")
                    checkingAccount.Balance -= request.Amount;
                else
                    checkingAccount.Balance += request.Amount;

                _context.Entry(checkingAccount).Property(x => x.Balance).IsModified = true;
                await _context.SaveChangesAsync();

                var activityLog = new UserActivityLogs
                {
                    Email = request.Email,
                    ActivityType = request.transaction_type == "W" ? "Withdrawal" : "Deposit",
                    Amount = request.Amount,
                    ActivityDate = DateTime.UtcNow
                };
                _context.UserActivityLogs.Add(activityLog);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { Message = "Transaction successful." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }

                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }

    [HttpPost("transferBetweenAccountsSavings")]
    public async Task<IActionResult> transferBetweenAccountsSavings([FromBody] TransferRequest request)
    {
        if (request.Amount <= 0)
        {
            return BadRequest("Invalid transfer amount.");
        }

        using (var transaction = await _context.Database.BeginTransactionAsync(CancellationToken.None))
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var savingsAccount = await _context.SavingsAccounts.FirstOrDefaultAsync(u => u.user_id == user.Id);
                if (savingsAccount == null)
                {
                    return NotFound("Savings account not found.");
                }

                var checkingAccount = await _context.CheckingsAccounts.FirstOrDefaultAsync(s => s.user_id == user.Id);
                if (checkingAccount == null)
                {
                    return NotFound("Checking account not found.");
                }

                var savingsTransaction = new SavingsTransaction
                {
                    user_id = user.Id,
                    savings_account_id = savingsAccount.savings_account_id,
                    TransactionDate = DateTime.Now,
                    Amount = request.Amount,
                    Description = request.description,
                    TransactionType = request.transaction_type
                };
                _context.SavingsTransactions.Add(savingsTransaction);
                await _context.SaveChangesAsync();

                savingsAccount.Balance -= request.Amount;
                _context.Entry(savingsAccount).Property(x => x.Balance).IsModified = true;
                await _context.SaveChangesAsync();

                var checkingTransaction = new CheckingTransactions
                {
                    user_id = user.Id,
                    checking_account_id = checkingAccount.checking_account_id,
                    TransactionDate = DateTime.Now,
                    Amount = request.Amount,
                    Description = "Transfer from Savings",
                    TransactionType = "Transfer"
                };
                _context.CheckingTransactions.Add(checkingTransaction);
                await _context.SaveChangesAsync();

                checkingAccount.Balance += request.Amount;
                _context.Entry(checkingAccount).Property(x => x.Balance).IsModified = true;
                await _context.SaveChangesAsync();

                var activityLog = new UserActivityLogs
                {
                    Email = request.Email,
                    ActivityType = request.transaction_type == "W" ? "Withdrawal" : "Deposit",
                    Amount = request.Amount,
                    ActivityDate = DateTime.UtcNow
                };
                _context.UserActivityLogs.Add(activityLog);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { Message = "Transfer successful." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }

                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
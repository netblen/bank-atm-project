// Models/Account.cs
using System.ComponentModel.DataAnnotations;

namespace atm_backend.Data.Models
{
    //Savings
        public class SavingsAccount
    {
        public int savings_account_id { get; set; }
        public int user_id { get; set; }
        public decimal Balance { get; set; }
        public decimal interest_rate { get; set; }
        public DateTime date_opened { get; set; }
    }
    public class SavingsTransaction
    {
        public int Id { get; set; }
        public int user_id { get; set; }
        public int savings_account_id { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string TransactionType { get; set; }
    }

    //Checking
    public class CheckingsAccount
    {
        public int checking_account_id { get; set; }
        public int user_id { get; set; }
        public decimal Balance { get; set; }
        public decimal overdraft_limit { get; set; }
        public DateTime date_opened { get; set; }

    }
    public class CheckingTransactions
    {
        public int Id { get; set; }
        public int user_id { get; set; }
        public int checking_account_id { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string TransactionType { get; set; } 
    }
    //Transfer Request
    public class TransferRequest
    {
        public string Email { get; set; }
        public decimal Amount { get; set; }

        public string description  { get; set; }

         public string transaction_type  { get; set; }
    }
    //Activity Logs
    public class UserActivityLogs
    {
        public int Id { get; set; }
        public string Email { get; set; }
        
        public string ActivityType  { get; set; }

         public decimal Amount { get; set; }

          public DateTime ActivityDate  { get; set; } 
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace atm_backend.Data.Models
{
    //Savings
    public class SavingsAccount
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int savings_account_id { get; set; }
        public int user_id { get; set; }
        public decimal Balance { get; set; }
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
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int checking_account_id { get; set; }
        public int user_id { get; set; }
        public decimal Balance { get; set; }
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

    public class Appointment
    {
        public int Id { get; set; }
        public string UserEmail { get; set; }
        public string Reason { get; set; }
        public DateTime AppointmentDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserUpdateDto
    {
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "City is required.")]
        public string City { get; set; }

        [Required(ErrorMessage = "Postal code is required.")]
        public string PostalCode { get; set; }

        [Required(ErrorMessage = "Profession is required.")]
        public string Profession { get; set; }

        [Required(ErrorMessage = "Security Question is required.")]
        public string SecurityQuestion { get; set; }

        [Required(ErrorMessage = "Security Answer is required.")]
        public string SecurityAnswer { get; set; }
    }

    //Feedback
    public class Feedback
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Comments { get; set; }
    }

    //Customer Feedback
    public class CustomerFeedback
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }

}


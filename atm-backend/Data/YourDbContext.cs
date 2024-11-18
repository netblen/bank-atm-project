using Microsoft.EntityFrameworkCore;
using atm_backend.Data.Models;

namespace atm_backend.Data  
{
    public class YourDbContext : DbContext
    {
        public YourDbContext(DbContextOptions<YourDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        //Savings
        public DbSet<SavingsAccount> SavingsAccounts { get; set; }
        public DbSet<SavingsTransaction> SavingsTransactions { get; set; }
        //Checking
        public DbSet<CheckingsAccount> CheckingsAccounts { get; set; }
        public DbSet<CheckingTransactions> CheckingTransactions { get; set; }
        //Admin
        public DbSet<UserActivityLogs> UserActivityLogs { get; set; }
        //Appoiments
        public DbSet<Appointment> Appointments { get; set; }
        //Feedback
        public DbSet<Feedback> Feedbacks { get; set; }
        //Customer
        public DbSet<CustomerFeedback> CustomerFeedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CheckingsAccount>()
                .HasKey(c => c.checking_account_id);

            modelBuilder.Entity<SavingsAccount>()
                .HasKey(c => c.savings_account_id);

            modelBuilder.Entity<SavingsTransaction>()
                .ToTable("SavingsTransactions")
                .Property(e => e.TransactionDate)
                .HasColumnName("transaction_date");
            
            modelBuilder.Entity<SavingsTransaction>()
                .Property(e => e.TransactionType)
                .HasColumnName("transaction_type");

            modelBuilder.Entity<CheckingTransactions>()
                .ToTable("CheckingTransactions")
                .Property(e => e.TransactionDate)
                .HasColumnName("transaction_date");
            
            modelBuilder.Entity<CheckingTransactions>()
                .Property(e => e.TransactionType)
                .HasColumnName("transaction_type");
            
            modelBuilder.Entity<UserActivityLogs>()
                .HasKey(c => c.Id);
            
        }
    }
}
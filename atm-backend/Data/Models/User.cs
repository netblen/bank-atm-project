using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace atm_backend.Data.Models
{
using System.ComponentModel.DataAnnotations;

    public class User
    {
        public int Id { get; set; } // Primary key

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } // Email of the user

        [Required(ErrorMessage = "First name is required.")]
        public string first_name { get; set; } // First name of the user

        [Required(ErrorMessage = "Last name is required.")]
        public string last_name { get; set; } // Last name of the user

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } // User's password (should be hashed in DB)

        public string Telephone { get; set; } // Optional telephone number

        public string City { get; set; } // City where the user lives

        public string postal_code { get; set; } // Postal code for the user's address

        [Required(ErrorMessage = "Security question is required.")]
        public string security_question { get; set; } // Security question for account recovery

        public string security_answer { get; set; } // Answer to the security question

        public string Profession { get; set; } // Profession of the user

        public DateTime created_at { get; set; } = DateTime.Now; // Date when the user signed up (auto-generated)

        [Required(ErrorMessage = "Date of birth is required.")]
        [DataType(DataType.Date)]
        public DateTime date_of_birth { get; set; } // User's date of birth

        public string rol { get; set; } 
    }

    public class SignInRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string ContactInfo { get; set; }
        public string SecurityCode { get; set; }
        public string NewPassword { get; set; }
    }

    public class ChangePassword
    {
        public string Email { get; set; }
        public string SecurityQuestion { get; set; }
        public string SecurityAnswer { get; set; } 
        public string NewPassword { get; set; }
    }

}
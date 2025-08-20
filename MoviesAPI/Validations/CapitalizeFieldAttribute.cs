using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.Validations
{
    public class CapitalizeFieldAttribute: ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return ValidationResult.Success;
            }

            var firstLetter = value.ToString()![0].ToString();
            if(firstLetter != firstLetter.ToUpper())
            {
                return new ValidationResult("The first letter must be capitalized");
            }
            return ValidationResult.Success;
        }
    }
}

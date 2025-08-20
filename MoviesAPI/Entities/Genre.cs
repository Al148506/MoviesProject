using MoviesAPI.Validations;
using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.Entities
{
    public class Genre: IId
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "You must enter the {0}")]
        [StringLength(20, ErrorMessage ="The field {0} must have less than {1} characters")]
        [CapitalizeField]
        public required string Name { get; set; }
    }
}

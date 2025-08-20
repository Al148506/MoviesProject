using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.DTOs
{
    public class ActorCreationDTO
    {
        [Required]
        [StringLength(150)]
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        [Unicode(false)]
        public IFormFile? Photo { get; set; }
    }
}

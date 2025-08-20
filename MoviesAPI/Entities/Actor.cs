using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.Entities
{
    public class Actor: IId
    {
        public int Id {get; set;}
        [Required]
        [StringLength(150)]
        public string Name {get; set;}
        public DateTime BirthDate {get; set;}
        [Unicode(false)]
        public string? Photo {get; set;}
    }
}

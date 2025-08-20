using Microsoft.EntityFrameworkCore;
using MoviesAPI.Entities;
using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.DTOs
{
    public class ActorDTO: IId
    {
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public string? Photo { get; set; }
    }
}

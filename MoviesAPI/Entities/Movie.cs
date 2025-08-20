using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries.Prepared;
using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.Entities
{
    public class Movie: IId
    {
        public int Id { get; set; }
        [Required]
        [StringLength(300)]
        public required string Title { get; set; }
        public string? Trailer { get; set; }
        public DateTime ReleaseDate { get; set; }
        [Unicode(false)]
        public string? Poster { get; set; }

        public List<MovieGenre> MoviesGenres { get; set; } = new List<MovieGenre>();
        public List<MovieCinema> MoviesCinemas { get; set; } = new List<MovieCinema>();
        public List<MovieActor> MoviesActor { get; set; } = new List<MovieActor>();

    }
}

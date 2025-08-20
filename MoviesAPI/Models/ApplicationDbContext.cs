using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MoviesAPI.Entities;

namespace MoviesAPI.Models
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MovieGenre>().HasKey(e => new {e.GenreId, e.MovieId});
            modelBuilder.Entity<MovieActor>().HasKey(e => new {e.ActorId, e.MovieId});
            modelBuilder.Entity<MovieCinema>().HasKey(e => new {e.CinemaId, e.MovieId});
        }

        public DbSet<Genre> Genres { get; set; }
        public DbSet<Actor> Actors { get; set; }
        public DbSet<Cinema> Cinemas { get; set; }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<MovieGenre> MoviesGenres { get; set; }
        public DbSet<MovieActor> MoviesActors { get; set; }
        public DbSet<MovieCinema> MoviesCinemas { get; set; }

        public DbSet<Rating> RatingMovies { get; set; }


    }
}

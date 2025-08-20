namespace MoviesAPI.Entities
{
    public class MovieCinema
    {
        public int CinemaId { get; set; }
        public int MovieId { get; set; }
        public Cinema Cinema { get; set; } = null!;
        public Movie Movie { get; set; } = null!;


    }
}

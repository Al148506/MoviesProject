namespace MoviesAPI.DTOs
{
    public class MoviesPutGetDTO
    {
        public MovieDTO Movie { get; set; } = null!;
        public List<GenreDTO> GenresSelected { get; set; } = new List<GenreDTO>();
        public List<GenreDTO> GenresNotSelected { get; set; } = new List<GenreDTO>();
        public List<CinemaDTO> CinemasSelected { get; set; } = new List<CinemaDTO>();
        public List<CinemaDTO> CinemasNotSelected { get; set; } = new List<CinemaDTO>();
        public List<MoviesActorDTO> Actors { get; set; } = new List<MoviesActorDTO>();
    }
}

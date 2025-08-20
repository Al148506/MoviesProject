namespace MoviesAPI.DTOs
{
    public class MoviePostGetDTO
    {
        public List<GenreDTO> Genres { get; set; } = new List<GenreDTO>();
        public List<CinemaDTO> Cinemas { get; set; } = new List<CinemaDTO>();
    }
}

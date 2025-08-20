namespace MoviesAPI.DTOs
{
    public class LandingPageDTO
    {
        public List<MovieDTO> InCinemas { get; set; } = new List<MovieDTO>();
        public List<MovieDTO> ComingSoon { get; set; } = new List<MovieDTO>();
    }
}

namespace MoviesAPI.DTOs
{
    public class MoviesActorDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Photo{ get; set; }
        public string Character { get; set; } = null!;
    }
}

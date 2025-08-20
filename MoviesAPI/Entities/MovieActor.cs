using System.ComponentModel.DataAnnotations;

namespace MoviesAPI.Entities
{
    public class MovieActor
    {
        public int ActorId { get; set; }
        public int MovieId { get; set; }
        [StringLength(300)]
        public required string Character { get; set; }
        public int Order {  get; set; }
        public Actor Actor { get; set; } = null!;
        public Movie Movie { get; set; } = null!;
    }
}

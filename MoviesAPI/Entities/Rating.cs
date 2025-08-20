using Microsoft.AspNetCore.Identity;

namespace MoviesAPI.Entities
{
    public class Rating
    {
        public int Id { get; set; }
        public int Score {  get; set; }
        public int MovieId { get; set; }
        public required string UserId {  get; set; }
        public Movie Movie { get; set; } = null!;
        public IdentityUser User { get; set; } = null!;

    }
}

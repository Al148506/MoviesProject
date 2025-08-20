using MoviesAPI.Entities;

namespace MoviesAPI.TestEntities
{
    public class RepositorySqlServer : IRepository
    {
        private List<Genre> _genres;

        public RepositorySqlServer()
        {
            _genres = new List<Genre>
            {
                new Genre {Id = 1, Name = "Comedy SQL" },
                new Genre {Id = 2, Name = "Action SQL" },
                new Genre {Id = 3, Name = "Terror SQL" },
                new Genre {Id = 4, Name = "Romantic SQL" },
                new Genre {Id = 5, Name = "Documentary SQL" },
                new Genre {Id = 6, Name = "Sci-Fi SQL" },
                new Genre {Id = 7, Name = "Animation SQL" }
            };

        }

        public List<Genre> ObtainAllGenres()
        {
            return _genres;
        }
        public async Task<Genre?> ObtainGenreById(int id)
        {
            await Task.Delay(TimeSpan.FromSeconds(1));
            return _genres.FirstOrDefault(g => g.Id == id);
        }
        public void AddGenre(Genre genre)
        {
            if (genre == null) throw new ArgumentNullException(nameof(genre));
            if (_genres.Any(g => g.Name.Equals(genre.Name, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException("Genre already exists");
            }
            genre.Id = _genres.Max(g => g.Id) + 1; // Simple ID generation
            _genres.Add(genre);
        }
        public async Task UpdateGenre(Genre genre)
        {
            if (genre == null) throw new ArgumentNullException(nameof(genre));
            var existingGenre = await ObtainGenreById(genre.Id);
            if (existingGenre == null) throw new KeyNotFoundException("Genre not found");
            existingGenre.Name = genre.Name;
        }

        public async Task DeleteGenre(int id)
        {
            var genre = await ObtainGenreById(id);
            if (genre == null) throw new KeyNotFoundException("Genre not found");
            _genres.Remove(genre);
        }

        public bool Exists(string name)
        {
            var result = _genres.Any(g => g.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            return result;
        }
    }
}

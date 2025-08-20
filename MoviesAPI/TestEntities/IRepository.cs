using MoviesAPI.Entities;

namespace MoviesAPI.TestEntities
{
    public interface IRepository
    {
        List<Genre> ObtainAllGenres();
        Task<Genre?> ObtainGenreById(int id);
        void AddGenre(Genre genre);
        Task UpdateGenre(Genre genre);
        Task DeleteGenre(int id);
        bool Exists(string name);

    }
}

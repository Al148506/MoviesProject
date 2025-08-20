namespace MoviesAPI.Services
{
    public interface IStorageFiles
    {
        Task<string> Store(string container, IFormFile archive);
        Task Delete(string? route, string container);
        async Task<string> Edit(string? route, string container, IFormFile archive)
        {
            await Delete(route, container);
            return await Store(container, archive);
        }
    }
}

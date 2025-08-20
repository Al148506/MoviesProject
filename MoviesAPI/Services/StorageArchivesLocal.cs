
namespace MoviesAPI.Services
{
    public class StorageArchivesLocal : IStorageFiles
    {
        private readonly IWebHostEnvironment env;
        private readonly IHttpContextAccessor httpContextAccessor;

        public StorageArchivesLocal(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            this.env = env;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> Store(string container, IFormFile archive)
        {
            var extension = Path.GetExtension(archive.FileName);
            var archiveName = $"{Guid.NewGuid()}{extension}";
            string folder = Path.Combine(env.WebRootPath, container);

            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            string route = Path.Combine(folder, archiveName);
            using (var ms = new MemoryStream())
            {
                await archive.CopyToAsync(ms);
                var content = ms.ToArray();
                await File.WriteAllBytesAsync(route, content);
            }
            var request = httpContextAccessor.HttpContext!.Request!;
            var url = $"{request.Scheme}://{request.Host}";
            var urlArchive = Path.Combine(url,container,archiveName).Replace("\\","/");
            return urlArchive;

        }

        public Task Delete(string? route, string container)
        {
            if (string.IsNullOrEmpty(route))
            {
                return Task.CompletedTask;
            }

            var archiveName = Path.GetFileName(route);
            var archiveDirectory = Path.Combine(env.WebRootPath,container, archiveName);

            if (File.Exists(archiveDirectory))
            {
                File.Delete(archiveDirectory);
            }

            return Task.CompletedTask;
        }
    }
}

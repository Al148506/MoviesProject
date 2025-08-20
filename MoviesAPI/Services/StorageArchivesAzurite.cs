using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace MoviesAPI.Services
{
    public class StorageArchivesAzurite : IStorageFiles
    {
        private readonly string connectionString;

        public StorageArchivesAzurite(IConfiguration configuration)
        {
            // OJO: revisa que el nombre coincida con docker-compose y .env
            connectionString = configuration.GetConnectionString("AZURE_STORAGE_CONNECTION")!;
        }

        public async Task<string> Store(string container, IFormFile archive)
        {
            var client = new BlobContainerClient(connectionString, container);
            await client.CreateIfNotExistsAsync();
            await client.SetAccessPolicyAsync(PublicAccessType.Blob); // opcional

            var extension = Path.GetExtension(archive.FileName);
            var archiveName = $"{Guid.NewGuid()}{extension}";
            var blob = client.GetBlobClient(archiveName);

            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = archive.ContentType
            };

            await blob.UploadAsync(
                archive.OpenReadStream(),
                new BlobUploadOptions { HttpHeaders = blobHttpHeaders }
            );

            return blob.Uri.ToString();
        }

        public async Task Delete(string? route, string container)
        {
            if (string.IsNullOrEmpty(route))
                return;

            var client = new BlobContainerClient(connectionString, container);
            await client.CreateIfNotExistsAsync();

            var archiveName = Path.GetFileName(route);
            var blob = client.GetBlobClient(archiveName);
            await blob.DeleteIfExistsAsync();
        }
    }
}


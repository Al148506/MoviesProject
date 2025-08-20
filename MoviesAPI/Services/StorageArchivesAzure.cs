
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Data.Common;

namespace MoviesAPI.Services
{
    public class StorageArchivesAzure : IStorageFiles
    {
        private string connectionString;

        public StorageArchivesAzure(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("AzureStorageConnection")!;
        }
       
        public async Task<string> Store(string container, IFormFile archive)
        {
           var client = new BlobContainerClient(connectionString, container);
            await client.CreateIfNotExistsAsync();
            client.SetAccessPolicy(PublicAccessType.Blob);

            var extension = Path.GetExtension(archive.FileName);
            var archiveName = $"{Guid.NewGuid()}{extension}";
            var blob = client.GetBlobClient(archiveName);

            var blobHttpHeaders = new BlobHttpHeaders();
            blobHttpHeaders.ContentType = archive.ContentType;

            await blob.UploadAsync(archive.OpenReadStream(), blobHttpHeaders);
            return blob.Uri.ToString();
        }

        public async Task Delete(string? route, string container)
        {
            if (string.IsNullOrEmpty(route))
            {
                return;
            }

            var client = new BlobContainerClient(connectionString, container);
            await client.CreateIfNotExistsAsync();
            var archiveName = Path.GetFileName(route);
            var blob = client.GetBlobClient(archiveName);
            await blob.DeleteIfExistsAsync();
        }
    }
}

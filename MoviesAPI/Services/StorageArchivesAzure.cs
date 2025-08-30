using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace MoviesAPI.Services
{
  public class StorageArchivesAzure : IStorageFiles
  {
    private readonly string _connectionString;
    private readonly long _maxFileSizeBytes = 20 * 1024 * 1024; // 20 MB 
    private static readonly HashSet<string> _allowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"
        };

    public StorageArchivesAzure(IConfiguration configuration)
    {
      // 1) Intentar leer la cadena de conexión de la sección estándar
      _connectionString =
          configuration.GetConnectionString("AzureStorage")
          ?? configuration["AzureStorage:ConnectionString"]
          ?? throw new InvalidOperationException(
              "Falta la cadena de conexión de Azure Storage. " +
              "Define 'ConnectionStrings:AzureStorage' o 'AzureStorage:ConnectionString' en appsettings/UserSecrets/variables de entorno.");

      if (string.IsNullOrWhiteSpace(_connectionString))
      {
        throw new InvalidOperationException(
            "La cadena de conexión de Azure Storage está vacía. Revisa tu configuración.");
      }
    }

    public async Task<string> Store(string container, IFormFile archive)
    {
      // Validaciones de entrada
      if (archive is null || archive.Length == 0)
        throw new ArgumentException("No se recibió archivo o está vacío.", nameof(archive));

      if (archive.Length > _maxFileSizeBytes)
        throw new InvalidOperationException($"El archivo excede el límite de {_maxFileSizeBytes / (1024 * 1024)} MB.");

      var ext = Path.GetExtension(archive.FileName);
      if (string.IsNullOrWhiteSpace(ext) || !_allowedExtensions.Contains(ext))
        throw new InvalidOperationException($"Extensión no permitida: '{ext}'. Permitidas: {string.Join(", ", _allowedExtensions)}");

      var containerName = NormalizeAndValidateContainer(container);

      // Cliente de contenedor
      var containerClient = new BlobContainerClient(_connectionString, containerName);

      // Crear contenedor si no existe
      await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

      // Nombre único para el blob
      var blobName = $"{Guid.NewGuid()}{ext}";
      var blobClient = containerClient.GetBlobClient(blobName);

      // Encabezados (tipo de contenido)
      var headers = new BlobHttpHeaders { ContentType = archive.ContentType ?? "application/octet-stream" };

      // Subida (usar using para cerrar stream)
      await using var stream = archive.OpenReadStream();
      try
      {
        await blobClient.UploadAsync(stream, new BlobUploadOptions
        {
          HttpHeaders = headers
        });
      }
      catch (RequestFailedException ex)
      {
        // Mensaje más claro para capas superiores / logs
        throw new InvalidOperationException($"Error al subir a Blob Storage: {ex.Message}", ex);
      }

      return blobClient.Uri.ToString();
    }

    public async Task Delete(string? route, string container)
    {
      if (string.IsNullOrWhiteSpace(route))
        return;

      var containerName = NormalizeAndValidateContainer(container);

      // Aceptamos tanto rutas absolutas (URL) como nombres de blob
      string blobName;
      if (Uri.TryCreate(route, UriKind.Absolute, out var uri))
      {
        // Si es URL, extraemos el nombre (la parte final del path)
        blobName = Path.GetFileName(uri.LocalPath);
        if (string.IsNullOrWhiteSpace(blobName))
          return;
      }
      else
      {
        // Se asume que es un nombre de blob directo
        blobName = Path.GetFileName(route);
      }

      var containerClient = new BlobContainerClient(_connectionString, containerName);
      await containerClient.CreateIfNotExistsAsync();

      var blob = containerClient.GetBlobClient(blobName);
      try
      {
        await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
      }
      catch (RequestFailedException ex)
      {
        // No tirar la app si ya no existe; propaga sólo si es algo distinto
        if (ex.Status != 404)
          throw new InvalidOperationException($"Error al eliminar del Blob Storage: {ex.Message}", ex);
      }
    }

    private static string NormalizeAndValidateContainer(string container)
    {
      if (string.IsNullOrWhiteSpace(container))
        throw new ArgumentException("El nombre del contenedor es obligatorio.", nameof(container));

      var normalized = container.Trim().ToLowerInvariant();

      // Validación básica de nombre de contenedor (reglas de Azure: 3-63, minúsculas, números y guiones, no empezar/terminar con guión, sin guiones consecutivos)
      if (normalized.Length < 3 || normalized.Length > 63)
        throw new ArgumentException("El nombre del contenedor debe tener entre 3 y 63 caracteres.");

      if (!System.Text.RegularExpressions.Regex.IsMatch(normalized, @"^(?!-)(?!.*--)[a-z0-9-]+(?<!-)$"))
        throw new ArgumentException("Nombre de contenedor inválido. Usa solo minúsculas, números y guiones; sin guiones al inicio/fin ni dobles guiones.");

      return normalized;
    }
  }
}

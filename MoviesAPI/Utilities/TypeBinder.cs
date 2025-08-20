using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Text.Json;

namespace MoviesAPI.Utilities
{
    public class TypeBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var namePropierty = bindingContext.ModelName;
            var value = bindingContext.ValueProvider.GetValue(namePropierty);

            if (value == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            try
            {
                var typeDestiny = bindingContext.ModelMetadata.ModelType;
                var valueDeserialized = JsonSerializer.Deserialize(value.FirstValue!, typeDestiny, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                bindingContext.Result = ModelBindingResult.Success(valueDeserialized);
            }
            catch
            {
                bindingContext.ModelState.TryAddModelError(namePropierty, "The data type of the value is incorrect");
            }
            return Task.CompletedTask;
        }
    }
}

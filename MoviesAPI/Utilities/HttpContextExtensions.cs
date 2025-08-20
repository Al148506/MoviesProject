using Microsoft.EntityFrameworkCore;

namespace MoviesAPI.Utilities
{
    public static class HttpContextExtensions
    {
        public async static Task InsertParamsPaginationHeader<T>(this HttpContext httpContext,
            IQueryable<T> queryable)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }
            double quantity = await queryable.CountAsync();
            httpContext.Response.Headers.Append("total-records-quantity", quantity.ToString());
        }
    }
}

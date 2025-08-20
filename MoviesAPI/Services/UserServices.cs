using Microsoft.AspNetCore.Identity;

namespace MoviesAPI.Services
{
    public class UserServices : IUserServices
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly UserManager<IdentityUser> userManager;

        public UserServices(IHttpContextAccessor httpContextAccessor, UserManager<IdentityUser> userManager)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.userManager = userManager;
        }

        public async Task<string> ObtainUserId()
        {
            var email = httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(x => x.Type == "email")!.Value;
            var user = await userManager.FindByEmailAsync(email);
            return user!.Id;
        }
    }
}

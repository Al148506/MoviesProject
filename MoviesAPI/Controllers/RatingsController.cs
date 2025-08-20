using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using MoviesAPI.Models;
using MoviesAPI.Services;

namespace MoviesAPI.Controllers
{
    [ApiController]
    [Route("api/rating")]
    public class RatingsController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IUserServices userServices;

        public RatingsController(ApplicationDbContext context, IUserServices userServices)
        {
            this.context = context;
            this.userServices = userServices;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Post([FromBody] RatingCreationDTO ratingCreationDTO)
        {
            var userId = await userServices.ObtainUserId();
            var ratingActual = await context.RatingMovies
                .FirstOrDefaultAsync(p => p.MovieId == ratingCreationDTO.MovieId
                && p.UserId == userId);

            if (ratingActual == null)
            {
                var rating = new Rating()
                {
                    MovieId = ratingCreationDTO.MovieId,
                    Score = ratingCreationDTO.Score,
                    UserId = userId
                };
                context.Add(rating);
            }
            else
            {
                ratingActual.Score = ratingCreationDTO.Score;
            }
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}

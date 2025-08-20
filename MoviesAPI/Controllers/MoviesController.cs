using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using MoviesAPI.Models;
using MoviesAPI.Services;
using MoviesAPI.Utilities;

namespace MoviesAPI.Controllers
{
    [Route("api/movies")]
    [ApiController]
    [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
    public class MoviesController : CustomBaseController
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly IStorageFiles storageFiles;
        private readonly IUserServices userServices;
        private const string cacheTag = "movies";
        private readonly string container = "movies";

        public MoviesController(ApplicationDbContext context, IMapper mapper, IOutputCacheStore outputCacheStore, IStorageFiles storageFiles, IUserServices userServices)
            :base(context, mapper, outputCacheStore, cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.outputCacheStore = outputCacheStore;
            this.storageFiles = storageFiles;
            this.userServices = userServices;
        }

        [HttpGet("landing")]
        [OutputCache(Tags = [cacheTag])]
        [AllowAnonymous]
        public async Task<ActionResult<LandingPageDTO>> Get()
        {
            var top = 6;
            var today = DateTime.Today;

            var comingSoon = await context.Movies.Where(p => p.ReleaseDate > today)
                .OrderBy(p => p.ReleaseDate)
                .Take(top)
                .ProjectTo<MovieDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            var onCinemas = await context.Movies
                .Where(p => p.MoviesCinemas.Select(pc => pc.MovieId).Contains(p.Id))
                .OrderBy(p => p.ReleaseDate)
                .Take(top)
                .ProjectTo<MovieDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            var result = new LandingPageDTO();
            result.InCinemas = onCinemas;
            result.ComingSoon = comingSoon;
            return result;
        }

        [HttpGet("{id:int}", Name = "GetMovieById")]
        [AllowAnonymous]
        public async Task<ActionResult<MovieDetailsDTO>> Get(int id)
        {
            var movie = await context.Movies
                .ProjectTo<MovieDetailsDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(p=>p.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            var averageVote = 0.0;
            var userVote = 0;

            if (await context.RatingMovies.AnyAsync(r => r.MovieId == id))
            {
                averageVote = await context.RatingMovies.Where(r => r.MovieId == id).AverageAsync(r => r.Score);

                if (HttpContext.User.Identity!.IsAuthenticated)
                {
                    var userId = await userServices.ObtainUserId();

                    var ratingDB = await context.RatingMovies
                        .FirstOrDefaultAsync(r => r.UserId == userId && r.MovieId == id);

                    if (ratingDB is not null)
                    {
                        userVote = ratingDB.Score;
                    }
                }
            }

            movie.AverageVote = averageVote;
            movie.UserVote = userVote;
            return movie;
        }

        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<ActionResult<List<MovieDTO>>> Filter([FromQuery] MoviesFilterDTO moviesFilterDTO)
        {
            var moviesQueryable = context.Movies.AsQueryable();
            if (!string.IsNullOrWhiteSpace(moviesFilterDTO.Title))
            {
                moviesQueryable = moviesQueryable.Where(m => m.Title.Contains(moviesFilterDTO.Title));
            }
            if (moviesFilterDTO.InCinemas)
            {
                moviesQueryable = moviesQueryable.Where(p => 
                p.MoviesCinemas.Select(pc => pc.MovieId).Contains(p.Id));
            }
            if (moviesFilterDTO.ComingSoon)
            {
                var today= DateTime.Today;
                moviesQueryable = moviesQueryable.Where(p =>
                p.ReleaseDate > today);
            }
            if(moviesFilterDTO.GenreId != 0)
            {
                moviesQueryable = moviesQueryable
                    .Where(p => p.MoviesGenres.Select(mg => mg.GenreId).Contains(moviesFilterDTO.GenreId));
            }

            await HttpContext.InsertParamsPaginationHeader(moviesQueryable);

            var movies = await moviesQueryable.Paginate(moviesFilterDTO.Pagination)
                .ProjectTo<MovieDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            return movies;

        }

        [HttpGet("PostGet")]
        public async Task<ActionResult<MoviePostGetDTO>> PostGet()
        {
            var cinemas = await context.Cinemas.ProjectTo<CinemaDTO>(mapper.ConfigurationProvider).ToListAsync();
            var genres = await context.Genres.ProjectTo<GenreDTO>(mapper.ConfigurationProvider).ToListAsync();

            return new MoviePostGetDTO
            {
                Cinemas = cinemas,
                Genres = genres
            };
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] MovieCreationDTO movieCreationDTO)
        {
            var movie = mapper.Map<Movie>(movieCreationDTO);
            if (movieCreationDTO.Poster != null)
            {
                var url = await storageFiles.Store(container, movieCreationDTO.Poster);
                movie.Poster = url;
            }
            AsignOrderActors(movie);
            context.Add(movie);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            var movieDTO = mapper.Map<MovieDTO>(movie);
            return CreatedAtRoute("GetMovieById", new {id = movie.Id}, movieDTO);
        }
        [HttpGet("PutGet/{id:int}")]
        public async Task<ActionResult<MoviesPutGetDTO>> PutGet(int id)
        {
            var movie = await context.Movies
                .ProjectTo<MovieDetailsDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }

            var genresSelectedIds = movie.Genres.Select(g => g.Id).ToList();
            var genresNotSelected = await context.Genres
                .Where(g => !genresSelectedIds.Contains(g.Id))
                .ProjectTo<GenreDTO>(mapper.ConfigurationProvider)
                .ToListAsync();
            var cinemasSelectedIds = movie.Cinemas.Select(c => c.Id).ToList();
            var cinemasNotSelected = await context.Cinemas
                .Where(c => !cinemasSelectedIds.Contains(c.Id))
                .ProjectTo<CinemaDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            var response = new MoviesPutGetDTO();
            response.Movie = movie;
            response.GenresSelected = movie.Genres;
            response.GenresNotSelected = genresNotSelected;
            response.CinemasSelected = movie.Cinemas;
            response.CinemasNotSelected= cinemasNotSelected;
            response.Actors = movie.Actors;
            return response;

        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromForm] MovieCreationDTO movieCreationDTO)
        {
            var movie = await context.Movies
                .Include(m => m.MoviesActor)
                .Include(m => m.MoviesCinemas)
                .Include(m => m.MoviesGenres)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (movie == null)
            {
                return NotFound();
            }
            movie = mapper.Map(movieCreationDTO, movie);

            if(movieCreationDTO.Poster is not null)
            {
                movie.Poster = await storageFiles.Edit(movie.Poster, container, movieCreationDTO.Poster);
            }
            AsignOrderActors(movie);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }


        private void AsignOrderActors(Movie movie)
        {
            if (movie.MoviesActor != null)
            {
                for (var i = 0; i < movie.MoviesActor.Count; i++)
                {
                    movie.MoviesActor[i].Order = i;
                }
            }
        }
        [HttpDelete("{id:int}")]
        public async Task <IActionResult> Delete (int id)
        {
            return await Delete<Movie>(id);

        }

    }
}

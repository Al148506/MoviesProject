using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using MoviesAPI.Models;
using MoviesAPI.TestEntities;
using MoviesAPI.Utilities;

namespace MoviesAPI.Controllers
{ 
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isadmin")]
    public class GenresController : CustomBaseController
    {
       
        private readonly IOutputCacheStore outputCacheStore;
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private const string cacheTag = "genres";

        public GenresController(
            IOutputCacheStore outputCacheStore, ApplicationDbContext context,
            IMapper mapper)
            :base(context, mapper, outputCacheStore,cacheTag)
        {
        
            this.outputCacheStore = outputCacheStore;
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet] //api/genre
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<GenreDTO>> Get([FromQuery] PaginationDTO pagination)
        {
            return await Get<Genre,GenreDTO>(pagination, orderBy: g=>g.Name);
     
          
        }

        [HttpGet("all")] //api/genre/all
        [OutputCache(Tags = [cacheTag])]
        [AllowAnonymous]
        public async Task<List<GenreDTO>> Get()
        {
            return await Get<Genre, GenreDTO>(orderBy: g => g.Name);


        }

        [HttpGet("{id:int}",Name = "ObtainGenreById")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<GenreDTO>> GetById(int id)
        {
           return await Get<Genre, GenreDTO>(id);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGenre([FromBody] GenreCreationDTO genreCreationDTO)
        {
            return await Post<GenreCreationDTO, Genre, GenreDTO>(genreCreationDTO, "ObtainGenreById");
           
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateGenre(int id, [FromBody] GenreCreationDTO genreCreationDTO)
        {
            return await Put<GenreCreationDTO, Genre>(id, genreCreationDTO);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            return await Delete<Genre>(id);
        }
    }
}


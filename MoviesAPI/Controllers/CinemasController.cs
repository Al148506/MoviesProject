using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using MoviesAPI.Models;

namespace MoviesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isadmin")]
    public class CinemasController : CustomBaseController
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore output;
        private const string cacheTag = "cinemas";

        public CinemasController(ApplicationDbContext context, IMapper mapper, IOutputCacheStore output)
            : base(context, mapper, output, cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.output = output;
        }
        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<CinemaDTO>> Get([FromQuery] PaginationDTO pagination)
        {
            return await Get<Cinema, CinemaDTO>(pagination, orderBy: c => c.Name);
        }
        [HttpGet("{id:int}", Name = "GetCinemaById")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<CinemaDTO>> Get(int id)
        {
            return await Get<Cinema, CinemaDTO>(id);
        }
        [HttpPost]
        public async Task<IActionResult> CreateCinema([FromBody] CinemaCreationDTO cinemaCreationDTO)
        {
            return await Post<CinemaCreationDTO, Cinema, CinemaDTO>(cinemaCreationDTO, "GetCinemaById");
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCinema(int id, [FromBody] CinemaCreationDTO cinemaCreationDTO)
        {
            return await Put<CinemaCreationDTO, Cinema>(id, cinemaCreationDTO);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCinema(int id)
        {
            return await Delete<Cinema>(id);
        }
    }
}

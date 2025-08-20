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
using MoviesAPI.Services;
using MoviesAPI.Utilities;

namespace MoviesAPI.Controllers
{
    [Route("api/actors")]
    [ApiController]
    [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme, Policy = "isadmin")]

    public class ActorsController : CustomBaseController
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly IStorageFiles storageFiles;
        private const string cacheTag = "actors";
        private readonly string container = "actors";

        public ActorsController(ApplicationDbContext context, IMapper mapper, IOutputCacheStore outputCacheStore, IStorageFiles storageFiles)
               : base(context, mapper,outputCacheStore,cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.outputCacheStore = outputCacheStore;
            this.storageFiles = storageFiles;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<ActorDTO>> Get([FromQuery] PaginationDTO pagination)
        {
            return await Get<Actor, ActorDTO>(pagination, orderBy: a => a.Name);

        }

        [HttpGet("{id:int}", Name = "GetActorById")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<ActorDTO>> Get(int id)
        {
            return await Get<Actor, ActorDTO>(id);
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<List<MoviesActorDTO>>> Get(string name)
        {
            return await context.Actors.Where(a => a.Name.Contains(name))
                .ProjectTo<MoviesActorDTO>(mapper.ConfigurationProvider)
                .ToListAsync();
        }


        [HttpPost]
        public async Task<IActionResult> CreateActor([FromForm] ActorCreationDTO actorCreationDTO)
        {
            var actor = mapper.Map<Actor>(actorCreationDTO);
            if (actorCreationDTO.Photo != null)
            {
                var url = await storageFiles.Store(container, actorCreationDTO.Photo);
                actor.Photo = url;
            }

            context.Add(actor);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return CreatedAtRoute("GetActorById", new { id = actor.Id }, actor);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromForm] ActorCreationDTO actorCreationDTO)
        {
            var actor = await context.Actors.FirstOrDefaultAsync(a => a.Id == id);
            if (actor == null)
            {
                return NotFound();
            }
            actor = mapper.Map(actorCreationDTO, actor);
            if (actorCreationDTO.Photo is not null)
            {
                actor.Photo = await storageFiles.Edit(actor.Photo, container, actorCreationDTO.Photo);
            }
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            return await Delete<Actor>(id);
        }
    }
}

using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using MoviesAPI.Models;
using MoviesAPI.Utilities;
using System.Linq.Expressions;

namespace MoviesAPI.Controllers
{
    public class CustomBaseController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly string cacheTag;

        public CustomBaseController(ApplicationDbContext context, IMapper mapper, IOutputCacheStore outputCacheStore, string cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.outputCacheStore = outputCacheStore;
            this.cacheTag = cacheTag;
        }
        protected async Task<List<TDTO>> Get<TEntity, TDTO>(
           Expression<Func<TEntity, object>> orderBy)
           where TEntity : class
        {
            return await context.Set<TEntity>()
              .OrderBy(orderBy)
              .ProjectTo<TDTO>(mapper.ConfigurationProvider).ToListAsync();
        }

        protected async Task<List<TDTO>> Get<TEntity, TDTO>(PaginationDTO pagination,
            Expression<Func<TEntity, object>> orderBy)
            where TEntity : class
        {
            var queryable = context.Set<TEntity>().AsQueryable();
            await HttpContext.InsertParamsPaginationHeader(queryable);
            return await queryable
              .OrderBy(orderBy)
              .Paginate(pagination)
              .ProjectTo<TDTO>(mapper.ConfigurationProvider).ToListAsync();
        }
        protected async Task<ActionResult<TDTO>> Get<TEntity, TDTO>(int id)
            where TEntity : class, IId
            where TDTO : IId
        {
            var entity = await context.Set<TEntity>()
                .ProjectTo<TDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        protected async Task<IActionResult> Post<TCreateDTO, TEntity,  TDTO>
            (TCreateDTO createDTO, string nameRoute)
            where TEntity : class, IId
        {
            var entity = mapper.Map<TEntity>(createDTO);
            context.Add(entity);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);

            var entityDTO = mapper.Map<TDTO>(entity);
            return CreatedAtRoute(nameRoute, new { id = entity.Id }, entityDTO);

        }

        protected async Task<IActionResult> Put<TCreateDTO, TEntity>(int  id, TCreateDTO createDTO)
            where TEntity : class, IId
        {
            var entityExists = await context.Set<TEntity>().AnyAsync(g => g.Id == id);
            if (!entityExists)
            {
                return NotFound();
            }
            var entity = mapper.Map<TEntity>(createDTO);
            entity.Id = id;
            context.Update(entity);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }
        protected async Task<IActionResult> Delete<TEntity>(int id)
            where TEntity : class, IId
        {
            var registerToDelete = await context.Set<TEntity>().Where(g => g.Id == id).ExecuteDeleteAsync();
            if (registerToDelete == 0)
            {
                return NotFound();
            }
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }

    }
}

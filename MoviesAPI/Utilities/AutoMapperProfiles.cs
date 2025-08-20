using AutoMapper;
using Microsoft.AspNetCore.Identity;
using MoviesAPI.DTOs;
using MoviesAPI.Entities;
using NetTopologySuite.Geometries;

namespace MoviesAPI.Utilities
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles(GeometryFactory geometryFactory) {
            ConfigureGenreMap();
            ConfigureActorMap();
            ConfigureCinemaMap(geometryFactory);
            ConfigureMovieMap();
            ConfigureUserMap();

        }

        private void ConfigureUserMap()
        {
            CreateMap<IdentityUser, UserDTO>();
        }

        private void ConfigureMovieMap()
        {
            CreateMap<MovieCreationDTO, Movie>()
                 .ForMember(x => x.Poster, options => options.Ignore())
                 .ForMember(x => x.MoviesGenres, dto =>
                 dto.MapFrom(p => p.GenresIds!.Select(id => new MovieGenre { GenreId = id })))
                 .ForMember(x => x.MoviesCinemas, dto =>
                 dto.MapFrom(p => p.CinemasIds!.Select(id => new MovieCinema { CinemaId = id })))
                 .ForMember(x => x.MoviesActor, dto =>
                 dto.MapFrom(p => p.Actors!.Select(actor => 
                 new MovieActor { ActorId = actor.Id, Character = actor.Character })));


            CreateMap<Movie, MovieDTO>();

            CreateMap<Movie, MovieDetailsDTO>()
                .ForMember(p => p.Genres, entity => entity.MapFrom(p => p.MoviesGenres))
                .ForMember(p => p.Cinemas, entity => entity.MapFrom(p => p.MoviesCinemas))
                .ForMember(p => p.Actors, entity => entity.MapFrom(p => p.MoviesActor.OrderBy(o => o.Order)));

            CreateMap<MovieGenre, GenreDTO>()
                .ForMember(g => g.Id, mg => mg.MapFrom(p => p.GenreId))
                .ForMember(g => g.Name, mg => mg.MapFrom(p => p.Genre.Name));

            CreateMap<MovieCinema, CinemaDTO>()
                .ForMember(g => g.Id, mg => mg.MapFrom(p => p.CinemaId))
                .ForMember(g => g.Name, mg => mg.MapFrom(p => p.Cinema.Name))
                .ForMember(g => g.Latitude, mg => mg.MapFrom(p => p.Cinema.Location.Y))
                .ForMember(g => g.Longitude, mg => mg.MapFrom(p => p.Cinema.Location.X));

            CreateMap<MovieActor, MoviesActorDTO>()
                .ForMember(g => g.Id, mg => mg.MapFrom(p => p.ActorId))
                .ForMember(g => g.Name, mg => mg.MapFrom(p => p.Actor.Name))
                .ForMember(g => g.Photo, mg => mg.MapFrom(p => p.Actor.Photo));



        }

        private void ConfigureCinemaMap(GeometryFactory geometryFactory)
        {
            CreateMap<Cinema,CinemaDTO>()
                .ForMember(x => x.Latitude, cine => cine.MapFrom(c => c.Location.Y))
                .ForMember(x => x.Longitude, cine => cine.MapFrom(c => c.Location.X));

            CreateMap<CinemaCreationDTO, Cinema>()
                .ForMember(x => x.Location, CinemaDTO => CinemaDTO.MapFrom(c =>
                geometryFactory.CreatePoint(new Coordinate(c.Longitude, c.Latitude))));

        }
        private void ConfigureGenreMap()
        {
            CreateMap<GenreCreationDTO, Genre>();
            CreateMap<Genre,GenreDTO>();
         
        }

        private void ConfigureActorMap()
        {
            CreateMap<ActorCreationDTO, Actor>()
                .ForMember(x => x.Photo, options => options.Ignore());
            CreateMap<Actor, ActorCreationDTO>();
            CreateMap<Actor,ActorDTO>();
            CreateMap<Actor, MoviesActorDTO>();
        }
    }
}

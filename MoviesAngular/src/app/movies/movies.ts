import { ActorAutoCompleteDTO } from '../actors/actors';
import { CinemaDTO } from '../cinemas/cinemas';
import { GenreDTO } from '../genres/genres';

export interface MovieDTO {
  id: number;
  title: string;
  releaseDate: string;
  trailer: string;
  poster?: string;
  genres?: GenreDTO[];
  cinemas?: CinemaDTO[];
  actors?: ActorAutoCompleteDTO[];
  userVote: number;
  averageVote: number;
}
export interface MovieCreationDTO {
  title: string;
  releaseDate: Date;
  trailer: string;
  poster?: File;
  genresIds?: number[];
  cinemasIds?: number[];
  actors?: ActorAutoCompleteDTO[];
}
export interface MoviesPostGetDTO {
  genres: GenreDTO[];
  cinemas: CinemaDTO[];
}

export interface LandingPageDTO {
  inCinemas: MovieDTO[];
  comingSoon: MovieDTO[];
}

export interface MoviesPutGetDTO {
  movie: MovieDTO;
  genresSelected: GenreDTO[];
  genresNotSelected: GenreDTO[];
  cinemasSelected: CinemaDTO[];
  cinemasNotSelected: CinemaDTO[];
  actors: ActorAutoCompleteDTO[];
}

import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceGenerosComponent } from './genres/index-genre/index-genre.component';
import { CreateGenresComponent } from './genres/create-genres/create-genres.component';
import { ActorsIndexComponent } from './actors/actors-index/actors-index.component';
import { CreateActorComponent } from './actors/create-actor/create-actor.component';
import { CreateCinemaComponent } from './cinemas/create-cinema/create-cinema.component';
import { CinemasIndexComponent } from './cinemas/cinemas-index/cinemas-index.component';
import { CreateMovieComponent } from './movies/create-movie/create-movie.component';
import { EditGenreComponent } from './genres/edit-genre/edit-genre.component';
import { EditActorComponent } from './actors/edit-actor/edit-actor.component';
import { EditCinemaComponent } from './cinemas/edit-cinema/edit-cinema.component';
import { EditMovieComponent } from './movies/edit-movie/edit-movie.component';
import { FilterMoviesComponent } from './movies/filter-movies/filter-movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { itsAdminGuard } from './shared/guards/its-admin.guard';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { UsersIndexComponent } from './security/users-index/users-index.component';
export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'genres',
    component: IndiceGenerosComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'genres/create',
    component: CreateGenresComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'genres/edit/:id',
    component: EditGenreComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'actors',
    component: ActorsIndexComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'actors/create',
    component: CreateActorComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'actors/edit/:id',
    component: EditActorComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'cinemas',
    component: CinemasIndexComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'cinemas/create',
    component: CreateCinemaComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'cinemas/edit/:id',
    component: EditCinemaComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'movies/create',
    component: CreateMovieComponent,
    canActivate: [itsAdminGuard],
  },
  {
    path: 'movies/edit/:id',
    component: EditMovieComponent,
    canActivate: [itsAdminGuard],
  },
  { path: 'movies/filter', component: FilterMoviesComponent }, // Add the filter movies route
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UsersIndexComponent, canActivate: [itsAdminGuard]},

  { path: '**', redirectTo: '' }, // Redirect to the landing page for any unknown routes
];

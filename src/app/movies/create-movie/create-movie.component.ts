import { Component, inject, model } from '@angular/core';
import { MovieCreationDTO } from '../movies';
import { FormMoviesComponent } from '../form-movies/form-movies.component';
import { SelectorMultipleDTO } from '../../shared/components/multiple-selector/multiple-selector-model';
import { ActorAutoCompleteDTO } from '../../actors/actors';
import { MoviesService } from '../movies.service';
import { Router } from '@angular/router';
import { extractErrors } from '../../shared/functions/extractErrors';
import { ShowErrorsComponent } from "../../shared/components/show-errors/show-errors.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";

@Component({
  selector: 'app-create-movie',
  imports: [FormMoviesComponent, ShowErrorsComponent, LoadingComponent],
  templateUrl: './create-movie.component.html',
  styleUrl: './create-movie.component.css',
})
export class CreateMovieComponent {
  genreSelected: SelectorMultipleDTO[] = [];
  genreNotSelected: SelectorMultipleDTO[] = [];
  cinemasSelected: SelectorMultipleDTO[] = [];
  cinemasNotSelected: SelectorMultipleDTO[] = [];
  actorsSelected: ActorAutoCompleteDTO[] = [];
  moviesService = inject(MoviesService);
  router = inject(Router);
  errors: string[] = [];

  constructor() {
    this.moviesService.createGet().subscribe(model => {
      this.genreNotSelected = model.genres.map(genre => {
        return <SelectorMultipleDTO>{key: genre.id, value: genre.name};
      })

      this.cinemasNotSelected = model.cinemas.map(cinema => {
        return<SelectorMultipleDTO>{key: cinema.id, value: cinema.name};
      })
    });
  }

  saveChanges(movie: MovieCreationDTO) {
    this.moviesService.create(movie).subscribe({
      next: movie => {
        console.log(movie);
        this.router.navigate(['/']);
      },
      error: (err) => {
        const errors = extractErrors(err);
        this.errors = errors;
      }
    })
  }
}

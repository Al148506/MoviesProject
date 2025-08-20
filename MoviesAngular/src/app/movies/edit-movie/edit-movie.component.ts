import {
  Component,
  inject,
  Input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { MovieCreationDTO, MovieDTO } from '../movies';
import { FormMoviesComponent } from '../form-movies/form-movies.component';
import { SelectorMultipleDTO } from '../../shared/components/multiple-selector/multiple-selector-model';
import { ActorAutoCompleteDTO } from '../../actors/actors';
import { MoviesService } from '../movies.service';
import { MultipleSelectorComponent } from '../../shared/components/multiple-selector/multiple-selector.component';
import { Router } from '@angular/router';
import { extractErrors } from '../../shared/functions/extractErrors';
import { ShowErrorsComponent } from '../../shared/components/show-errors/show-errors.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-edit-movie',
  imports: [FormMoviesComponent, ShowErrorsComponent, LoadingComponent],
  templateUrl: './edit-movie.component.html',
  styleUrl: './edit-movie.component.css',
})
export class EditMovieComponent implements OnInit {
  ngOnInit(): void {
    this.moviesService.updateGet(this.id).subscribe((model) => {
      this.movie = model.movie;
      // Transforma la fecha para que funcione con input[type="date"]
      this.movie.releaseDate = this.transformDate(model.movie.releaseDate);
      this.actorsSelected = model.actors;
      this.cinemasSelected = model.cinemasNotSelected.map((cinema) => {
        return <SelectorMultipleDTO>{ key: cinema.id, value: cinema.name };
      });

      this.cinemasNotSelected = model.cinemasNotSelected.map((cinema) => {
        return <SelectorMultipleDTO>{ key: cinema.id, value: cinema.name };
      });

      this.cinemasSelected = model.cinemasSelected.map((cinema) => {
        return <SelectorMultipleDTO>{ key: cinema.id, value: cinema.name };
      });

      this.genresNotSelected = model.genresNotSelected.map((genre) => {
        return <SelectorMultipleDTO>{ key: genre.id, value: genre.name };
      });

      this.genresSelected = model.genresSelected.map((genre) => {
        return <SelectorMultipleDTO>{ key: genre.id, value: genre.name };
      });
      console.log('Fecha original:', model.movie.releaseDate);
      console.log('Tipo:', typeof model.movie.releaseDate);
    });
  }
  private transformDate(date: string): string {
    return date.split('T')[0]; // Retorna solo 'YYYY-MM-DD'
  }

  @Input({ transform: numberAttribute })
  id!: number;

  movie!: MovieDTO;
  genresSelected!: SelectorMultipleDTO[];
  genresNotSelected!: SelectorMultipleDTO[];
  cinemasSelected!: SelectorMultipleDTO[];
  cinemasNotSelected!: SelectorMultipleDTO[];
  actorsSelected!: ActorAutoCompleteDTO[];

  moviesService = inject(MoviesService);
  router = inject(Router);
  errors: string[] = [];

  saveChanges(movie: MovieCreationDTO) {
    this.moviesService.update(this.id, movie).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        const errors = extractErrors(err);
        this.errors = errors;
      },
    });
  }
}

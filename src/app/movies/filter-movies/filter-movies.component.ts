import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterMovie } from './filterMovie';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ListMoviesComponent } from '../list-movies/list-movies';
import { GenreDTO } from '../../genres/genres';
import { MovieCreationDTO, MovieDTO } from '../movies';
import { GenresService } from '../../genres/genres.service';
import { MoviesService } from '../movies.service';
import { PaginationDTO } from '../../shared/models/PaginationDTO';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounce, debounceTime } from 'rxjs';
@Component({
  selector: 'app-filter-movies',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ListMoviesComponent,
    MatPaginatorModule,
  ],
  templateUrl: './filter-movies.component.html',
  styleUrl: './filter-movies.component.css',
})
export class FilterMoviesComponent implements OnInit {
  genresService = inject(GenresService);
  moviesService = inject(MoviesService);
  pagination: PaginationDTO = { page: 1, recordsPerPage: 10 };
  totalrecordsQuantity!: number;

  ngOnInit(): void {
    this.genresService.obtainAll().subscribe((genres)  => {
      this.genres = genres;
      this.readUrlParameters();
      this.searchMovies(this.form.value as FilterMovie);

       // Subscription for all values in the form
       
      this.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((values) => {
        console.log(values);
        this.searchMovies(values as FilterMovie);
        this.searchParametersUrl(values as FilterMovie);
      });
    // 👉 Subscription in specific fields for mutual exclusion:

        this.form.get('comingSoon')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('inCinemas')?.setValue(false, { emitEvent: false });
      }
    });

    this.form.get('inCinemas')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('comingSoon')?.setValue(false, { emitEvent: false });
      }
    });
    });
  }

  searchMovies(values: FilterMovie) {
    values.page = this.pagination.page;
    values.recordsPerPage = this.pagination.recordsPerPage;

    this.moviesService.filter(values).subscribe((response) => {
      this.movies = response.body as MovieDTO[];
      const header = response.headers.get('total-records-quantity') as string;
      this.totalrecordsQuantity = parseInt(header, 10);
    });
  }
  searchParametersUrl(values: FilterMovie) {
    let queryString = [];
    if (values.title) {
      queryString.push(`title=${encodeURIComponent(values.title)}`);
    }
    if (values.genreId !== 0) {
      queryString.push(`genreId=${values.genreId}`);
    }
    if (values.comingSoon) {
      queryString.push(`upcomingReleases=${values.comingSoon}`);
    }
    if (values.inCinemas) {
      queryString.push(`inCinemas=${values.inCinemas}`);
    }
    this.location.replaceState('movies/filter', queryString.join('&'));
  }

  readUrlParameters() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.form.patchValue({
        title: params['title'] || '',
        genreId: params['genreId'] ? Number(params['genreId']) : 0, // 👈 Conversión aquí
        comingSoon: params['comingSoon'] || false,
        inCinemas: params['inCinemas'] || false,
      });
    });
  }

  clean() {
    this.form.patchValue({
      title: '',
      genreId: 0,
      comingSoon: false,
      inCinemas: false,
    });
  }

  updatePagination(data: PageEvent) {
    this.pagination = {
      page: data.pageIndex + 1,
      recordsPerPage: data.pageSize,
    };
    this.searchMovies(this.form.value as FilterMovie);
  }

  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);

  form = this.formBuilder.group({
    title: '',
    genreId: 0,
    comingSoon: false,
    inCinemas: false,
  });
  genres!: GenreDTO[];
  movies!: MovieDTO[];
}

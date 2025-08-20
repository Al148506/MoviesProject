import { Component, inject, OnInit, effect } from '@angular/core';
import { MoviesService } from '../movies/movies.service';
import { ListMoviesComponent } from '../movies/list-movies/list-movies';
import { CommonModule } from '@angular/common';
import { AuthorizedComponent } from "../security/authorized/authorized.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ListMoviesComponent, CommonModule, AuthorizedComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {

  moviesService = inject(MoviesService);

  moviesInCinemas!: any[];
  moviesComingSoon!: any[];

  constructor() {
    this.loadMovies();
  }


  loadMovies(): void {
    this.moviesService.obtainLandingPage().subscribe({
      next: (modelo) => {

        this.moviesInCinemas = [...modelo.inCinemas];
        this.moviesComingSoon = [...modelo.comingSoon];
      },
      error: (err) => {
        console.error('[LandingPageComponent] Loading movies error: ', err);
      },
      complete: () => {
        console.log('[LandingPageComponent] Loading movies complete.');
      }
    });
  }

  movieDeleted(): void {
    this.loadMovies();
  }
}

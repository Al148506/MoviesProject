import {
  CurrencyPipe,
  DatePipe,
  NgFor,
  NgIf,
  NgOptimizedImage,
  UpperCasePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/components/menu/menu.component';
import { RatingComponent } from './shared/components/rating/rating.component';
import { ListMoviesComponent } from './movies/list-movies/list-movies';

@Component({
  selector: 'app-root',
  imports: [
    ListMoviesComponent,
    MenuComponent,
    RatingComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}

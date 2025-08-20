import {
  Component,
  inject,
  Input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { MoviesService } from '../movies.service';
import { MovieDTO } from '../movies';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Coordinate } from '../../shared/components/map/coordinate';
import { MapComponent } from '../../shared/components/map/map.component';
import { RatingService } from '../../rating/rating.service';
import Swal from 'sweetalert2';
import { SecurityService } from '../../security/security.service';
import { RatingComponent } from "../../shared/components/rating/rating.component";

@Component({
  selector: 'app-movie-details',
  imports: [LoadingComponent, MatChipsModule, RouterLink, MapComponent, RatingComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  @Input({ transform: numberAttribute })
  id!: number;

  moviesService = inject(MoviesService);
  ratingService = inject(RatingService);
  securityService = inject(SecurityService);
  movie!: MovieDTO;
  releaseDateShow!: Date;
  sanitizer = inject(DomSanitizer);
  trailerURL!: SafeResourceUrl;
  coordinates: Coordinate[] = [];

  ngOnInit(): void {
    this.moviesService.obtainById(this.id).subscribe((movie) => {
      this.releaseDateShow = new Date(movie.releaseDate);
      this.movie = movie;
      this.trailerURL = this.generateURLYoutubeEmbed(movie.trailer);
      this.coordinates = movie.cinemas!.map((cinema) => {
        return <Coordinate>{
          latitude: cinema.latitude,
          longitude: cinema.longitude,
          text: cinema.name,
        };
      });
    });
  }

  generateURLYoutubeEmbed(url: string): SafeResourceUrl | string {
    if (!url) {
      return '';
    }
    var videoId = url.split('v=')[1];
    var positionAmpersand = videoId.indexOf('&');
    if (positionAmpersand !== -1) {
      videoId = videoId.substring(0, positionAmpersand);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }

  rating(score: number) {
    if (!this.securityService.itsLogged()) {
      Swal.fire('Error', 'You must login to vote', 'error');
    }
    this.ratingService.rating(this.id, score).subscribe(() => {
      Swal.fire('Success', 'Your vote has been sent', 'success');
    });
  }
}

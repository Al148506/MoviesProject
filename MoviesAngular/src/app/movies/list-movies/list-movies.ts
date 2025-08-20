import { DatePipe, UpperCasePipe, CurrencyPipe, CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GenericListComponent } from '../../shared/components/generic-list/generic-list.component';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { MoviesService } from '../movies.service';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthorizedComponent } from "../../security/authorized/authorized.component";

@Component({
  selector: 'app-list-movies',
  standalone: true,
  imports: [
    DatePipe,
    UpperCasePipe,
    CurrencyPipe,
    GenericListComponent,
    MatButtonModule,
    MatIconModule,
    RatingComponent,
    RouterLink,
    CommonModule,
    SweetAlert2Module,
    AuthorizedComponent
],
  templateUrl: './list-movies.component.html',
  styleUrl: './list-movies.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ListMoviesComponent {
  @Input({ required: true })
  movies!: any[];
  moviesService = inject(MoviesService);
  @Output()
  deleted = new EventEmitter<void>();

  delete(id:number){
    this.moviesService.delete(id).subscribe(() => 
    this.deleted.emit())
  }
}

import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MapComponent } from '../../shared/components/map/map.component';
import { MovieCreationDTO, MovieDTO } from '../movies';
import moment from 'moment';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { InputImgComponent } from '../../shared/components/input-img/input-img.component';
import { MultipleSelectorComponent } from '../../shared/components/multiple-selector/multiple-selector.component';
import { SelectorMultipleDTO } from '../../shared/components/multiple-selector/multiple-selector-model';
import { AutocompleteActorsComponent } from '../../actors/autocomplete-actors/autocomplete-actors.component';
import { ActorAutoCompleteDTO } from '../../actors/actors';

@Component({
  selector: 'app-form-movies',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MapComponent,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerModule,
    InputImgComponent,
    MultipleSelectorComponent,
    AutocompleteActorsComponent,
  ],
  templateUrl: './form-movies.component.html',
  styleUrl: './form-movies.component.css',
})
export class FormMoviesComponent implements OnInit {
  ngOnInit(): void {
    if (this.model !== undefined) {
      const modelCopy = {
        ...this.model,
        releaseDate: this.model.releaseDate
          ? new Date(this.model.releaseDate)
          : null,
      };
      this.form.patchValue(modelCopy);
    }
  }

  @Input({ required: true })
  genreNotSelected!: SelectorMultipleDTO[];

  @Input({ required: true })
  genreSelected!: SelectorMultipleDTO[];

  @Input({ required: true })
  cinemasNotSelected!: SelectorMultipleDTO[];

  @Input({ required: true })
  cinemasSelected!: SelectorMultipleDTO[];

  @Input({ required: true })
  actorsSelected!: ActorAutoCompleteDTO[];

  @Input()
  model?: MovieDTO;

  @Output()
  postform = new EventEmitter<MovieCreationDTO>();
  private formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    title: ['', { validators: [Validators.required] }],
    releaseDate: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    trailer: '',
    poster: new FormControl<File | string | null>(null),
  });

  selectedArchive(file: File) {
    this.form.controls.poster.setValue(file);
  }
  saveChanges() {
    if (!this.form.valid) {
      return;
    }
    const movie = this.form.value as MovieCreationDTO;
    movie.releaseDate = moment(movie.releaseDate).toDate();
    const genresIds = this.genreSelected.map((val) => val.key);
    const cinemasIds = this.cinemasSelected.map((val) => val.key);
    movie.genresIds = genresIds;
    movie.cinemasIds = cinemasIds;
    movie.actors = this.actorsSelected;
    this.postform.emit(movie);
  }
  obtainErrorFieldTitle(): string {
    let field = this.form.controls.title;
    if (field.hasError('required')) {
      return 'The field title is required';
    }
    return '';
  }
  obtainErrorFieldReleaseDate(): string {
    let field = this.form.controls.releaseDate;
    if (field.hasError('required')) {
      return 'The field release date is required';
    }
    return '';
  }
}

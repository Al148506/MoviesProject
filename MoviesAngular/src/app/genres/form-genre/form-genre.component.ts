import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstCapitalLetter } from '../../shared/functions/validations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { GenreCreateDTO, GenreDTO } from '../genres';

@Component({
  selector: 'app-form-genre',
  imports: [
    MatButtonModule,
    RouterLink,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './form-genre.component.html',
  styleUrl: './form-genre.component.css',
})
export class FormGenreComponent implements OnInit {
  ngOnInit(): void {
    if (this.model) {
      this.form.patchValue(this.model);
    }
  }

  @Input()
  model?: GenreDTO;

  @Output()
  postForm = new EventEmitter<GenreCreateDTO>();

  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    name: [
      '',
      {
        validators: [
          Validators.required,
          firstCapitalLetter(),
          Validators.maxLength(20),
        ],
      },
    ],
  });
  obtainErrorMessage(field: string) {
    const fieldName = this.form.get(field);
    if (fieldName?.hasError('required')) {
      return `This field ${field} is required`;
    }
    if (fieldName?.hasError('maxlength')) {
      return `This field ${field} only admits a maximum of ${
        fieldName.getError('maxlength').requiredLength
      } characters`;
    }
    if (fieldName?.hasError('firstCapitalLetter')) {
      return fieldName.getError('firstCapitalLetter');
    }
    return '';
  }

  saveChanges() {
    // console.log(this.form.value);
    if (!this.form.valid || !this.form.value) return;

    const genre = this.form.value as GenreCreateDTO;
    this.postForm.emit(genre);
  }
}

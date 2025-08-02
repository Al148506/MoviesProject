import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { firstCapitalLetter } from '../../shared/functions/validations';
import { FormGenreComponent } from "../form-genre/form-genre.component";
import { GenreCreateDTO } from '../genres';
import { GenresService } from '../genres.service';
import { extractErrors } from '../../shared/functions/extractErrors';
import { ShowErrorsComponent } from "../../shared/components/show-errors/show-errors.component";
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';
import { CreateEntityComponent } from "../../shared/components/create-entity/create-entity.component";

@Component({
  selector: 'app-create-genres',
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, FormGenreComponent, ShowErrorsComponent, CreateEntityComponent],
  templateUrl: './create-genres.component.html',
  styleUrl: './create-genres.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: GenresService}
  ]
})
export class CreateGenresComponent {
  formGenres = FormGenreComponent;
  
}

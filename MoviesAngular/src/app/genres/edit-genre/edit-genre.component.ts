import {
  Component,
  inject,
  Input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { FormGenreComponent } from '../form-genre/form-genre.component';
import { GenreCreateDTO, GenreDTO } from '../genres';
import { GenresService } from '../genres.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ShowErrorsComponent } from '../../shared/components/show-errors/show-errors.component';
import { Router } from '@angular/router';
import { extractErrors } from '../../shared/functions/extractErrors';
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';
import { CreateEntityComponent } from "../../shared/components/create-entity/create-entity.component";
import { EditEntityComponent } from "../../shared/components/edit-entity/edit-entity.component";

@Component({
  selector: 'app-edit-genre',
  standalone: true,
  imports: [FormGenreComponent, LoadingComponent, ShowErrorsComponent, CreateEntityComponent, EditEntityComponent],
  templateUrl: './edit-genre.component.html',
  styleUrl: './edit-genre.component.css',
  providers: [{ provide: SERVICE_CRUD_TOKEN, useClass: GenresService }],
})
export class EditGenreComponent {
  @Input({ transform: numberAttribute })
  id!: number;
  formGenre = FormGenreComponent;
}

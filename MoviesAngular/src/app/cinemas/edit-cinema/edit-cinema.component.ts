import { Component, Input, numberAttribute } from '@angular/core';
import { CinemaCreationDTO, CinemaDTO } from '../cinemas';
import { FormCinemasComponent } from '../form-cinemas/form-cinemas.component';
import { CinemasService } from '../cinemas.service';
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';
import { EditEntityComponent } from "../../shared/components/edit-entity/edit-entity.component";

@Component({
  selector: 'app-edit-cinema',
  imports: [FormCinemasComponent, EditEntityComponent],
  templateUrl: './edit-cinema.component.html',
  styleUrl: './edit-cinema.component.css',
  providers: [{ provide: SERVICE_CRUD_TOKEN, useClass: CinemasService }],
})
export class EditCinemaComponent {
  @Input({ transform: numberAttribute })
  id!: number;
  formCinemas = FormCinemasComponent;
}

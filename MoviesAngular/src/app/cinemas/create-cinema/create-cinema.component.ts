import { Component } from '@angular/core';
import { CinemaCreationDTO } from '../cinemas';
import { FormCinemasComponent } from "../form-cinemas/form-cinemas.component";
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';
import { CinemasService } from '../cinemas.service';
import { CreateEntityComponent } from "../../shared/components/create-entity/create-entity.component";

@Component({
  selector: 'app-create-cinema',
  imports: [FormCinemasComponent, CreateEntityComponent],
  templateUrl: './create-cinema.component.html',
  styleUrl: './create-cinema.component.css',
  providers:
    [{
      provide: SERVICE_CRUD_TOKEN, useClass: CinemasService
    }]
})
export class CreateCinemaComponent {
  formCinemas = FormCinemasComponent;
}

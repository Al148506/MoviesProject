import { Component, inject } from '@angular/core';
import { FormActorsComponent } from "../form-actors/form-actors.component";
import { ActorCreateDTO } from '../actors';
import { ActorsService } from '../actors.service';
import { Router } from '@angular/router';
import { extractErrors } from '../../shared/functions/extractErrors';
import { ShowErrorsComponent } from "../../shared/components/show-errors/show-errors.component";
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';
import { CreateEntityComponent } from "../../shared/components/create-entity/create-entity.component";

@Component({
  selector: 'app-create-actor',
  imports: [FormActorsComponent, ShowErrorsComponent, CreateEntityComponent],
  templateUrl: './create-actor.component.html',
  styleUrl: './create-actor.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: ActorsService}
  ]
})
export class CreateActorComponent {
  formActors = FormActorsComponent;
}

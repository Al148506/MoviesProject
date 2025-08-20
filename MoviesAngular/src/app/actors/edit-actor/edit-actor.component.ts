import {
  Component,
  inject,
  Input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { ActorCreateDTO, ActorDTO } from '../actors';
import { FormActorsComponent } from '../form-actors/form-actors.component';
import { ActorsService } from '../actors.service';
import { Router } from '@angular/router';
import { extractErrors } from '../../shared/functions/extractErrors';
import { ShowErrorsComponent } from '../../shared/components/show-errors/show-errors.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EditEntityComponent } from '../../shared/components/edit-entity/edit-entity.component';
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';

@Component({
  selector: 'app-edit-actor',
  imports: [
    FormActorsComponent,
    ShowErrorsComponent,
    LoadingComponent,
    EditEntityComponent,
  ],
  templateUrl: './edit-actor.component.html',
  styleUrl: './edit-actor.component.css',
  providers: [{ provide: SERVICE_CRUD_TOKEN, useClass: ActorsService }],
})
export class EditActorComponent {
  @Input({ transform: numberAttribute })
  id!: number;

  formActors = FormActorsComponent;
}

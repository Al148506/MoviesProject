import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';
import { CinemasService } from '../cinemas.service';
import { EntityIndexComponent } from "../../shared/components/entity-index/entity-index.component";

@Component({
  selector: 'app-cinemas-index',
  imports: [MatButtonModule, RouterLink, EntityIndexComponent],
  templateUrl: './cinemas-index.component.html',
  styleUrl: './cinemas-index.component.css',
  providers:
  [{
    provide: SERVICE_CRUD_TOKEN, useClass: CinemasService
  }]
})
export class CinemasIndexComponent {

}

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ActorsService } from '../actors.service';
import { PaginationDTO } from '../../shared/models/PaginationDTO';
import { ActorDTO } from '../actors';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { GenericListComponent } from "../../shared/components/generic-list/generic-list.component";
import { MatTableModule } from '@angular/material/table';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';
import { EntityIndexComponent } from "../../shared/components/entity-index/entity-index.component";

@Component({
  selector: 'app-actors-index',
  imports: [RouterLink, MatButtonModule, GenericListComponent, MatTableModule, MatPaginatorModule, SweetAlert2Module, EntityIndexComponent],
  templateUrl: './actors-index.component.html',
  styleUrl: './actors-index.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: ActorsService}
  ]
})
export class ActorsIndexComponent {

}

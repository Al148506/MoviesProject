import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GenresService } from '../genres.service';
import { environment } from '../../../environments/environment';
import { GenreDTO } from '../genres';
import { MatTableModule } from '@angular/material/table';
import { GenericListComponent } from '../../shared/components/generic-list/generic-list.component';
import { HttpResponse } from '@angular/common/http';
import { PaginationDTO } from '../../shared/models/PaginationDTO';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EntityIndexComponent } from "../../shared/components/entity-index/entity-index.component";
import { SERVICE_CRUD_TOKEN } from '../../shared/providers/providers';

@Component({
  selector: 'app-indice-generos',
  imports: [
    EntityIndexComponent
],
  templateUrl: './index-genre.component.html',
  styleUrl: './index-genre.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: GenresService}
  ]
})
export class IndiceGenerosComponent {


}

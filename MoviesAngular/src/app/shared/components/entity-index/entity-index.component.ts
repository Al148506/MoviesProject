import { Component, inject, Input, input } from '@angular/core';
import { PaginationDTO } from '../../models/PaginationDTO';
import { SERVICE_CRUD_TOKEN } from '../../providers/providers';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { GenericListComponent } from "../generic-list/generic-list.component";
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { IServiceCRUD } from '../../interfaces/IServiceCRUD';

@Component({
  selector: 'app-entity-index',
  imports: [
    RouterLink,
    MatButtonModule,
    MatTableModule,
    GenericListComponent,
    MatPaginatorModule,
    SweetAlert2Module,],
  templateUrl: './entity-index.component.html',
  styleUrl: './entity-index.component.css'
})
export class EntityIndexComponent<TDTO, TCreateDTO> {
  @Input({required: true})
  title!: string;

  @Input({required: true})
  createRoute!: string;

  @Input({required: true})
  editRoute!: string;

  @Input()
  columnsToShow = ['id','name','actions'];

  serviceCRUD = inject(SERVICE_CRUD_TOKEN) as IServiceCRUD<TDTO,TCreateDTO>;
  
  pagination: PaginationDTO = { page: 1, recordsPerPage: 5 };
  entities!: TDTO[];
   totalRegistersQuantity!: number;

   constructor() {
    this.loadRegisters();
  }

    updatePagination(data: PageEvent) {
    this.pagination = {
      page: data.pageIndex + 1,
      recordsPerPage: data.pageSize,
    };
    this.loadRegisters();
  }

    loadRegisters() {
    this.serviceCRUD
      .obtainPagination(this.pagination)
      .subscribe((response: HttpResponse<TDTO[]>) => {
        this.entities = response.body as TDTO[];
        const header = response.headers.get('total-records-quantity') as string;
        this.totalRegistersQuantity = parseInt(header, 10);
      });
  }

  delete(id: number) {
    this.serviceCRUD.delete(id).subscribe(() => {
      this.pagination.page = 1;
      this.loadRegisters();
    });
  }

  capitalizeFirstLetter(value: string){
    if(!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}

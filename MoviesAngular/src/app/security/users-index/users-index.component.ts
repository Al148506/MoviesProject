import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { GenericListComponent } from '../../shared/components/generic-list/generic-list.component';
import { PaginationDTO } from '../../shared/models/PaginationDTO';
import { UserDTO } from '../security';
import { SecurityService } from '../security.service';
import { EmailValidator } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-index',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    GenericListComponent,
    MatTableModule,
    MatPaginatorModule,
    SweetAlert2Module,
  ],
  templateUrl: './users-index.component.html',
  styleUrl: './users-index.component.css',
})
export class UsersIndexComponent {
  columnsToShow = ['email', 'actions'];
  pagination: PaginationDTO = { page: 1, recordsPerPage: 10 };
  totalRecordsQuantity!: number;
  users!: UserDTO[];
  securityService = inject(SecurityService);

  constructor() {
    this.loadRegisters();
  }

  loadRegisters() {
    this.securityService
      .obtainUsersPaginated(this.pagination)
      .subscribe((response) => {
        this.users = response.body as UserDTO[];
        const header = response.headers.get('total-records-quantity') as string;
        this.totalRecordsQuantity = parseInt(header, 10);
      });
  }
  updatePagination(data: PageEvent) {
    this.pagination = {
      page: data.pageIndex + 1,
      recordsPerPage: data.pageSize,
    };
    this.loadRegisters();
  }

  grantAdmin(email: string) {
  this.securityService.grantAdmin(email).subscribe(() => {
    Swal.fire(
      'Success',
      `The user ${email} is now an administrator`,
      'success'
    ).then(() => {
      this.loadRegisters(); // <- Recargar datos después del cambio
    });
  });
}

removeAdmin(email: string) {
  this.securityService.removeAdmin(email).subscribe(() => {
    Swal.fire(
      'Success',
      `The user ${email} is no longer an administrator`,
      'success'
    ).then(() => {
      this.loadRegisters(); // <- Recargar datos después del cambio
    });
  });
}

}

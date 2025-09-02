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
import { finalize } from 'rxjs';

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

  updatePagination(data: PageEvent) {
    this.pagination = {
      page: data.pageIndex + 1,
      recordsPerPage: data.pageSize,
    };
    this.loadRegisters();
  }

  pending: Record<string, boolean> = {};

  loadRegisters() {
    this.securityService
      .obtainUsersPaginated(this.pagination)
      .subscribe((response) => {
        const raw = response.body as any[];
        // Normaliza isAdmin por si viene con otro nombre/forma
        this.users = raw.map((u) => ({
          ...u,
          isAdmin:
            typeof u.isAdmin === 'boolean'
              ? u.isAdmin
              : typeof u.isadmin === 'boolean'
              ? u.isadmin
              : !!u?.roles?.includes?.('admin'),
        }));
        const header = response.headers.get('total-records-quantity') as string;
        this.totalRecordsQuantity = parseInt(header, 10);
      });
  }
  grantAdmin(email: string, element: any) {
    this.pending[email] = true;
    this.securityService
      .grantAdmin(email)
      .pipe(
        finalize(() => {
          this.pending[email] = false;
        })
      )
      .subscribe({
        next: () => {
          element.isAdmin = true; // ✅ UI cambia inmediato

          // 🔁 Opción A: refrescar al cerrar el modal (da tiempo al backend)
          Swal.fire(
            'Success',
            `The user ${email} is now an administrator`,
            'success'
          ).then(() => this.loadRegisters());

          // 🔁 Opción B (si usas toast): setTimeout(() => this.loadRegisters(), 400);
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo asignar admin', 'error');
        },
      });
  }

  removeAdmin(email: string, element: any) {
    this.pending[email] = true;

    this.securityService
      .removeAdmin(email)
      .pipe(
        finalize(() => {
          this.pending[email] = false;
        })
      )
      .subscribe({
        next: () => {
          element.isAdmin = false; // ✅ UI cambia inmediato
          Swal.fire(
            'Success',
            `The user ${email} is no longer an administrator`,
            'success'
          ).then(() => this.loadRegisters());
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo remover admin', 'error');
        },
      });
  }
}

import { Observable } from 'rxjs';
import { PaginationDTO } from '../models/PaginationDTO';
import { HttpResponse } from '@angular/common/http';

export interface IServiceCRUD<TDTO, TCreateDTO> {
  obtainPagination(pagination: PaginationDTO): Observable<HttpResponse<TDTO[]>>;

  getById(id: number): Observable<TDTO>;

  create(entity: TCreateDTO): Observable<any>;

  update(id: number, entity: TCreateDTO): Observable<any>;

  delete(id: number): Observable<any>;
}

import { inject, Injectable } from '@angular/core';
import { IServiceCRUD } from '../shared/interfaces/IServiceCRUD';
import { CinemaCreationDTO, CinemaDTO } from './cinemas';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationDTO } from '../shared/models/PaginationDTO';
import { environment } from '../../environments/environment';
import { constructQueryParams } from '../shared/functions/constructQueryParams';

@Injectable({
  providedIn: 'root'
})
export class CinemasService implements IServiceCRUD<CinemaDTO,CinemaCreationDTO>{

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/cinema';
  obtainPagination(pagination: PaginationDTO): Observable<HttpResponse<CinemaDTO[]>> {
    let queryParams = constructQueryParams(pagination);
    return this.http.get<CinemaDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }
  getById(id: number): Observable<CinemaDTO> {
    return this.http.get<CinemaDTO>(`${this.urlBase}/${id}`);
  }
  create(entity: CinemaCreationDTO): Observable<any> {
     return this.http.post(this.urlBase, entity);
  }
  update(id: number, entity: CinemaCreationDTO): Observable<any> {
    return this.http.put(`${this.urlBase}/${id}`, entity);
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }
}

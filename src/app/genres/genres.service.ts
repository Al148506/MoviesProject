import { inject, Injectable } from '@angular/core';
import { GenreCreateDTO, GenreDTO } from './genres';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationDTO } from '../shared/models/PaginationDTO';
import { constructQueryParams } from '../shared/functions/constructQueryParams';
import { IServiceCRUD } from '../shared/interfaces/IServiceCRUD';

@Injectable({
  providedIn: 'root',
})
export class GenresService implements IServiceCRUD<GenreDTO,GenreCreateDTO> {
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/GenreSQL';
  constructor() {}

  public obtainPagination(
    pagination: PaginationDTO
  ): Observable<HttpResponse<GenreDTO[]>> {
    let queryParams = constructQueryParams(pagination);
    return this.http.get<GenreDTO[]>(this.urlBase, {
      params: queryParams,
      observe: 'response',
    });
  }
  public obtainAll():Observable<GenreDTO[]>{
    return this.http.get<GenreDTO[]>(`${this.urlBase}/all`)
  }

  public getById(id: number): Observable<GenreDTO> {
    return this.http.get<GenreDTO>(`${this.urlBase}/${id}`);
  }

  public create(genre: GenreCreateDTO) : Observable<any> {
    return this.http.post(this.urlBase, genre);
  }

  public update(id: number, genre: GenreCreateDTO) : Observable<any> {
    return this.http.put(`${this.urlBase}/${id}`, genre);
  }

  public delete(id: number) : Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }
}


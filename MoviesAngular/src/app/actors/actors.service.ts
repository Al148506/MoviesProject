import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActorAutoCompleteDTO, ActorCreateDTO, ActorDTO } from './actors';
import { PaginationDTO } from '../shared/models/PaginationDTO';
import { Observable } from 'rxjs';
import { constructQueryParams } from '../shared/functions/constructQueryParams';
import { IServiceCRUD } from '../shared/interfaces/IServiceCRUD';

@Injectable({
  providedIn: 'root',
})
export class ActorsService implements IServiceCRUD<ActorDTO, ActorCreateDTO> {
  constructor() {}
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/actors';

  public obtainPagination(
    pagination: PaginationDTO
  ): Observable<HttpResponse<ActorDTO[]>> {
    let queryParams = constructQueryParams(pagination);
    return this.http.get<ActorDTO[]>(this.urlBase, {
      params: queryParams,
      observe: 'response',
    });
  }

  public getById(id: number): Observable<ActorDTO> {
    return this.http.get<ActorDTO>(`${this.urlBase}/${id}`);
  }

  public getByName(name: string): Observable<ActorAutoCompleteDTO[]> {
    return this.http.get<ActorAutoCompleteDTO[]>(`${this.urlBase}/${name}`);
  }

  public update(id: number, actor: ActorCreateDTO) {
    const formData = this.constructFormData(actor);
    return this.http.put(`${this.urlBase}/${id}`, formData);
  }

  public create(actor: ActorCreateDTO) {
    const formData = this.constructFormData(actor);
    return this.http.post(this.urlBase, formData);
  }

  public delete(id: number) {
    return this.http.delete(`${this.urlBase}/${id}`);
  }

  private constructFormData(actor: ActorCreateDTO): FormData {
    const formData = new FormData();
    formData.append('name', actor.name);
    // 2024-01-25T15:18:20
    formData.append(
      'birthDate',
      new Date(actor.birthdate).toISOString().split('T')[0]
    );
    if (actor.photo) {
      formData.append('photo', actor.photo);
    }

    return formData;
  }
}

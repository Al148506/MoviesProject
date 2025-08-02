import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  LandingPageDTO,
  MovieCreationDTO,
  MovieDTO,
  MoviesPostGetDTO,
  MoviesPutGetDTO,
} from './movies';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor() {}

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/movies';

  public obtainLandingPage(): Observable<LandingPageDTO> {
    return this.http.get<LandingPageDTO>(`${this.urlBase}/landing`);
  }

  public obtainById(id: number): Observable<MovieDTO> {
    return this.http.get<MovieDTO>(`${this.urlBase}/${id}`);
  }

  public filter(values: any): Observable<HttpResponse<MovieDTO[]>> {
    const params = new HttpParams({ fromObject: values });
    return this.http.get<MovieDTO[]>(`${this.urlBase}/filter`, {
      params,
      observe: 'response',
    });
  }

  public createGet(): Observable<MoviesPostGetDTO> {
    return this.http.get<MoviesPostGetDTO>(`${this.urlBase}/postget`);
  }

  public create(movie: MovieCreationDTO): Observable<MovieDTO> {
    const formData = this.buildFormData(movie);
    return this.http.post<MovieDTO>(this.urlBase, formData);
  }

  public updateGet(id: number): Observable<MoviesPutGetDTO> {
    return this.http.get<MoviesPutGetDTO>(`${this.urlBase}/putget/${id}`);
  }

  public update(id: number, movie: MovieCreationDTO) {
    const formData = this.buildFormData(movie);
    return this.http.put(`${this.urlBase}/${id}`, formData);
  }

  public delete(id: number) {
    return this.http.delete(`${this.urlBase}/${id}`);
  }

  private buildFormData(movie: MovieCreationDTO): FormData {
    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append(
      'releaseDate',
      new Date(movie.releaseDate).toISOString().split('T')[0]
    );

    if (movie.poster) {
      formData.append('poster', movie.poster);
    }
    if (movie.trailer) {
      formData.append('trailer', movie.trailer);
    }
    formData.append('genresIds', JSON.stringify(movie.genresIds));
    formData.append('cinemasIds', JSON.stringify(movie.cinemasIds));
    formData.append('actors', JSON.stringify(movie.actors));

    return formData;
  }
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AuthenticationResponseDTO,
  UserCredentialsDTO,
  UserDTO,
} from './security';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationDTO } from '../shared/models/PaginationDTO';
import { constructQueryParams } from '../shared/functions/constructQueryParams';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor() {}

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/users';
  private readonly keyToken = 'token';
  private readonly keyExpiration = 'token-expiration';

  obtainUsersPaginated(
    pagination: PaginationDTO
  ): Observable<HttpResponse<UserDTO[]>> {
    let queryParams = constructQueryParams(pagination);
    return this.http.get<UserDTO[]>(`${this.urlBase}/ListUsers`, {
      params: queryParams,
      observe: 'response',
    });
  }

  grantAdmin(email: string) {
    return this.http.post(`${this.urlBase}/GrantAdmin`, { email });
  }

  removeAdmin(email: string) {
    return this.http.post(`${this.urlBase}/RemoveAdmin`, { email });
  }

  obtainToken(): string | null {
    return localStorage.getItem(this.keyToken);
  }
  register(
    credentials: UserCredentialsDTO
  ): Observable<AuthenticationResponseDTO> {
    return this.http
      .post<AuthenticationResponseDTO>(`${this.urlBase}/register`, credentials)
      .pipe(
        tap((authenticationResponse) => this.saveToken(authenticationResponse))
      );
  }
  login(
    credentials: UserCredentialsDTO
  ): Observable<AuthenticationResponseDTO> {
    return this.http
      .post<AuthenticationResponseDTO>(`${this.urlBase}/login`, credentials)
      .pipe(
        tap((authenticationResponse) => this.saveToken(authenticationResponse))
      );
  }

  saveToken(authenticationResponse: AuthenticationResponseDTO) {
    localStorage.setItem(this.keyToken, authenticationResponse.token);
    localStorage.setItem(
      this.keyExpiration,
      authenticationResponse.expiration.toString()
    );
  }

  itsLogged(): boolean {
    const token = localStorage.getItem(this.keyToken);
    if (!token) {
      return false;
    }
    const expiration = localStorage.getItem(this.keyExpiration)!;
    const expirationDate = new Date(expiration);

    if (expirationDate <= new Date()) {
      this.logout();
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem(this.keyToken);
    localStorage.removeItem(this.keyExpiration);
  }

  obtainRol(): string {
    const isAdmin = this.obtainFieldJWT('isadmin');
    if (isAdmin) {
      return 'admin';
    } else {
      return '';
    }
  }

  obtainFieldJWT(field: string): string {
    const token = localStorage.getItem(this.keyToken);
    if (!token) {
      return '';
    }
    var dataToken = JSON.parse(atob(token.split('.')[1]));
    return dataToken[field];
  }
}

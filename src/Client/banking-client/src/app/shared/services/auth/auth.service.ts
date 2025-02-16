import { Injectable } from '@angular/core';
import { AuthModel } from '../../models';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { BaseApi } from '../base-api.service';
import { isValidEmail } from '../../utils/validation.util';
import { AppStateManager } from '../../app.state-manager';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GetUser } from '../../models/get-user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private api: BaseApi,
    private appState: AppStateManager,
    private router: Router,
    private http: HttpClient
  ) {}
  baseApiUrl = environment.apiUrl + '/api/v1';

  public checkEmailExists(email: string) {
    return this.api.get<boolean>(`${this.baseApiUrl}/users/exists?email=${email}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.api.post<AuthModel>(`${this.baseApiUrl}/users/login`, { username, password }).pipe(
      map((auth: AuthModel) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('auth', JSON.stringify(auth));
        this.appState.setAuth(auth);
        return auth;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.appState.setAuth(null);
    this.router.navigate(['/login']);
  }

  getUserByAccountId(accountId: number): Observable<GetUser> {
    return this.http.get<GetUser>(`${this.baseApiUrl}/users/by-account/${accountId}`).pipe(
      map((user: GetUser) => {
        return user;
      })
    );
  }
}

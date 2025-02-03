import { Injectable } from '@angular/core';
import { AuthModel, User } from '../../models';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { BaseApi } from '../base-api.service';
import { isValidEmail } from '../../utils/validation.util';
import { AppStateManager } from '../../app.state-manager';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private api: BaseApi,
    private appState: AppStateManager,
    private router: Router
  ) {}

  public checkEmailExists(email: string) {
    if (!isValidEmail(email)) return of(false);
    return this.api.get<boolean>(`${this.api.baseApiUrl}/users/exists?email=${email}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.api.post<AuthModel>(`${this.api.baseApiUrl}/users/login`, { username, password }).pipe(
      map((auth: AuthModel) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('auth', JSON.stringify(auth));
        this.appState.setAuth(auth);
        return auth;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.appState.setAuth(null);
    this.router.navigate(['/login']);
  }
}

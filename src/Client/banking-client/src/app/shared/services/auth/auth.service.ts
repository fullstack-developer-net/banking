import { Injectable } from '@angular/core';
import { AuthModel, User } from '../../models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BaseApi } from '../base-api.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private api: BaseApi,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.api.post<AuthModel>(`${this.api.baseApiUrl}/users/login`, { username, password }).pipe(
      map((auth: AuthModel) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('auth', JSON.stringify(auth));
        return auth;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}

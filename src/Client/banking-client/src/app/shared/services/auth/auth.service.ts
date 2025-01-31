/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;

  constructor(private httpClient: HttpClient) {}

  // loadUser() {
  //   const promise = this._userManager.getUser();
  //   promise.then((user) => {
  //     if (user && !user.expired) {
  //       this._user = user;
  //     }
  //   });
  //   return promise;
  // }

  login(returnUrl: string): any {
    console.log('Return Url:', returnUrl);
    localStorage.setItem('returnUrl', returnUrl);
    // return this._userManager.signinRedirect();
  }

  logout(): any {
    // return this._userManager.signoutRedirect();
  }

  isLoggedIn(): any {
    // return this._user && this._user.access_token && !this._user.expired;
  }

  getAccessToken(): any {
    // return this._user ? this._user.access_token : '';
  }

  signoutRedirectCallback(): any {
    // return this._userManager.signoutRedirectCallback();
  }

  getCurrentUser(): any {
    // return {
    //   id: this._user.profile.sub,
    //   userName: 'phongnguyend',
    //   firstName: 'Phong',
    //   lastName: 'Nguyen'
    // };
  }

  isAuthenticated() {
    return this.isLoggedIn();
  }

  updateCurrentUser(firstName: string, lastName: string) {}
}

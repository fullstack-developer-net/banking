import { BehaviorSubject, Observable } from 'rxjs';
import { AuthModel, User } from './models';
import { AccountModel } from './models/account.model';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AppStateManager {
  private authSubject: BehaviorSubject<AuthModel | null> = new BehaviorSubject<AuthModel | null>(null);
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private accountSubject: BehaviorSubject<AccountModel | null> = new BehaviorSubject<AccountModel | null>(null);
  public readonly user$: Observable<User | null>;
  public readonly auth$: Observable<AuthModel | null>;
  public readonly account$: Observable<AccountModel | null>;

  constructor() {
    this.user$ = this.userSubject.asObservable();
    this.auth$ = this.authSubject.asObservable();
    this.account$ = this.accountSubject.asObservable();
  }
  public setAuth(auth: AuthModel | null) {
    this.authSubject.next(auth);
  }
  public setUser(user: User | null) {
    this.userSubject.next(user);
  }
  public setAccount(account: AccountModel | null) {
    this.accountSubject.next(account);
  }
}

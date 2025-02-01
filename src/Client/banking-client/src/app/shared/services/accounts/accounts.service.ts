import { Injectable } from '@angular/core';
import { BaseApi } from '../base-api.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AccountModel } from '../../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private api: BaseApi) {}

  private accountSubject: BehaviorSubject<AccountModel | null>;
  public account$: Observable<AccountModel | null>;

  public getAccounts() {
    return this.api.get<any[]>(`${this.api.baseApiUrl}/accounts`);
  }

  public getAccountByUserId(id: string) {
    return this.api.get<any>(`${this.api.baseApiUrl}/accounts/details?userId=${id}`).pipe(
      map((account: AccountModel) => {
        this.accountSubject.next(account);
        return account;
      })
    );
  }

  public getAccountById(id: number) {
    return this.api.get<any>(`${this.api.baseApiUrl}/accounts/details?accountId=${id}`).pipe(
      map((account: AccountModel) => {
        this.accountSubject.next(account);
        return account;
      })
    );
  }

  public getAccountByAccountNumber(accountNumber: string) {
    return this.api.get<any>(`${this.api.baseApiUrl}/accounts/details?accountNumber=${accountNumber}`).pipe(
      map((account: AccountModel) => {
        this.accountSubject.next(account);
        return account;
      })
    );
  }
}

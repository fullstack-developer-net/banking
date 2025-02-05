import { Injectable } from '@angular/core';
import { BaseApi } from '../base-api.service';
import { map } from 'rxjs';
import { AccountModel } from '../../models/account.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private api: BaseApi) {}
  baseApiUrl = environment.apiUrl + '/api/v1';

  public getAccounts() {
    return this.api.get<any[]>(`${this.baseApiUrl}/accounts`);
  }

  public getAccountByUserId(id: string) {
    return this.api.get<any>(`${this.baseApiUrl}/accounts/details?userId=${id}`).pipe(
      map((account: AccountModel) => {
        return account;
      })
    );
  }

  public getAccountById(id: number) {
    return this.api.get<any>(`${this.baseApiUrl}/accounts/details?accountId=${id}`).pipe(
      map((account: AccountModel) => {
        return account;
      })
    );
  }

  public getAccountByAccountNumber(accountNumber: string) {
    return this.api.get<any>(`$${this.baseApiUrl}/accounts/details?accountNumber=${accountNumber}`).pipe(
      map((account: AccountModel) => {
        return account;
      })
    );
  }
}

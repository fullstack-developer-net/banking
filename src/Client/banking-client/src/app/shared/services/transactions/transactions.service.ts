import { Injectable } from '@angular/core';
import { BaseApi } from '../base-api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private api: BaseApi) {}
  baseApiUrl = environment.apiUrl + '/api/v1';

  public getTransactions() {
    return this.api.get<any[]>(`${this.baseApiUrl}/transactions/list`);
  }
}

import { Injectable } from '@angular/core';
import { BaseApi } from '../base-api.service';
import { environment } from 'src/environments/environment';
import { TransactionModel, TransferModel } from '../../models/transaction.model';
import { map } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private api: BaseApi) {}
  baseApiUrl = environment.apiUrl + '/api/v1';

  public getTransactions() {
    return this.api.get<any[]>(`${this.baseApiUrl}/transactions`);
  }
  public createTransaction(transaction: TransferModel) {
    return this.api.post<TransferModel>(`${this.baseApiUrl}/transactions`, transaction);
  }

  public getByIdTransaction(id: number) {
    return this.api.get<TransactionModel>(`${this.baseApiUrl}/transactions/${id}`).pipe(
      map((transaction: TransactionModel) => {
        return transaction;
      })
    );
  }
}

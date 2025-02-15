import { Injectable } from '@angular/core';
import { BaseApi } from '../base-api.service';
import { environment } from 'src/environments/environment';
import { TransactionModel, TransferModel } from '../../models/transaction.model';
import { map } from 'rxjs';
 
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/models/paginated-response.model';
 
interface TransactionParams {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private api: BaseApi) {}
  baseApiUrl = environment.apiUrl + '/api/v1';

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

  public getTransactions(params: TransactionParams): Observable<PaginatedResponse<TransactionModel>> {
    const queryParams = {
      pageNumber: params.pageNumber.toString(),
      pageSize: params.pageSize.toString(),
      searchTerm: params.searchTerm
    };

    return this.api.get<PaginatedResponse<TransactionModel>>(`${this.baseApiUrl}/transactions`, { params: queryParams });
  }
}

import { Component } from '@angular/core';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { TransactionsService } from 'src/app/shared/services/transactions/transactions.service';
import { TransactionModel } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-latest-transactions-card',
  imports: [TransactionItemComponent],
  templateUrl: './latest-transactions-card.component.html',
  styleUrl: './latest-transactions-card.component.scss'
})
export class LatestTransactionsCardComponent {
  ListGroup : TransactionModel[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private transactionService: TransactionsService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.error = null;

    this.transactionService.getTransactions()
      .subscribe({
        next: (data: any) => {
          this.ListGroup = data.items;
          this.isLoading = false;
          console.info('Loading data transactions:', data);
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
          this.error = 'Failed to load transactions. Please try again later.';
          this.isLoading = false;
        }
      });
  }
}

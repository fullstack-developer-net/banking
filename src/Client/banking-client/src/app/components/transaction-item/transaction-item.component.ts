import { Component, Input } from '@angular/core';
import { TransactionModel } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss'
})
export class TransactionItemComponent {
  @Input() value: TransactionModel;
  get formattedAmount(): string {
    return this.value.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  get formattedDate(): string {
    return this.value.transactionTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

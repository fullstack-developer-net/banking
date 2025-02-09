import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss'
})
export class TransactionItemComponent {
  @Input() transactionId: string = '';
  @Input() fromAccountId: string = '';
  @Input() toAccountId: string = '';
  @Input() note: string = '';
  @Input() status: string = '';
  @Input() amount: number = 0;
  @Input() transactionTime: Date;

  get formattedAmount(): string {
    return this.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  get formattedDate(): string {
    return this.transactionTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

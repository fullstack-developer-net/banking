import { Component, Input } from '@angular/core';
import { CreditCardNumberPipe } from '../../shared/pipes/credit-card-number.pipe';

@Component({
  selector: 'app-transaction-item',
  imports: [CreditCardNumberPipe],
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss'
})
export class TransactionItemComponent {
  @Input() fullName: string = '';
  @Input() accountNumber: string = '';
  @Input() amount: number = 0;
  @Input() type: 'income' | 'outcome' = 'income';
  @Input() createdAt: Date;

  get isIncome(): boolean {
    return this.type === 'income';
  }
  get icon(): string {
    return this.type === 'income' ? 'ti ti-chevron-up' : 'ti ti-chevron-down';
  }
  get bgColor(): string {
    return this.type === 'income' ? 'bg-success' : 'bg-danger';
  }
  get color(): string {
    return this.type === 'income' ? 'text-success' : 'text-danger';
  }

  get formattedAmount(): string {
    return this.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  get formattedAccountNumber(): string {
    return this.accountNumber.replace(/(\d{4})/g, '$1 ');
  }

  get formattedDate(): string {
    return this.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

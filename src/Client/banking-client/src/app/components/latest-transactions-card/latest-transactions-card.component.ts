import { Component } from '@angular/core';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

@Component({
  selector: 'app-latest-transactions-card',
  imports: [TransactionItemComponent],
  templateUrl: './latest-transactions-card.component.html',
  styleUrl: './latest-transactions-card.component.scss'
})
export class LatestTransactionsCardComponent {
  ListGroup = [
    {
      fullName: 'Phuong Tran',
      accountNumber: '12345678901234',
      amount: 1000,
      type: 'outcome',
      createdAt: new Date()
    }
  ];
}

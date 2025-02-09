import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: '[app-account-item]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-item.component.html',
  styleUrl: './account-item.component.scss'
})
export class AccountItemComponent {
  @Input() fullName: string = '';
  @Input() accountNumber: string = '';
  @Input() balance: number = 0;

  get formattedAmount(): string {
    return this.balance.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
}

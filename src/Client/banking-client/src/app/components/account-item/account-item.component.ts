import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() accountId: string = '';

  @Output() viewDetails = new EventEmitter<string>();

  get formattedAmount(): string {
    return this.balance.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
  openDetails() {
    this.viewDetails.emit(this.accountId); // Phát sự kiện khi nhấp vào nút
  }
}

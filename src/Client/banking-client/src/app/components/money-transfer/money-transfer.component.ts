import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TransactionsService } from '../../shared/services/transactions/transactions.service';
import { TransferModel } from '../../shared/models/transaction.model';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../../shared/services/accounts/accounts.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AppStateManager } from 'src/app/shared/app.state-manager';


@Component({
  selector: 'app-money-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.scss'
})
export class MoneyTransferComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() closeModal = new EventEmitter<any>();
  senderId: string;
  recipientId: string | null = null;
  amount: number = 0;
  transactionSuccess: boolean = false;
  transactionError: boolean = false;
  recipientUsername: string | null = null;
  showConfirmModal: boolean = false;

  constructor(
    private transactionsService: TransactionsService,
    private accountsService: AccountsService,
    private authService: AuthService,
    private appState: AppStateManager
  ) {}

  ngOnInit(): void {
 
  }

  close() {
    this.closeModal.emit();
  }

  createTransaction() {
    this.showConfirmModal = true;
    console.log('createTransaction called, showConfirmModal:', this.showConfirmModal);
  }

  confirmTransaction() {
    if (this.amount <= 0) {
      this.transactionError = true;
      return;
    }

    const transaction: TransferModel = {
      toAccountId: parseInt(this.recipientId),
      amount: this.amount
    };

    this.transactionsService.createTransaction(transaction).subscribe({
      next: (response) => {
        console.log('Transaction created successfully:', response);
        this.transactionSuccess = true;
        this.close();
      },
      error: (error) => {
        console.error('Error creating transaction', error);
        this.transactionError = true;
      }
    });
  }

  getUserInfoByAccountId() {
    if (this.recipientId) {
      this.authService.getUserByAccountId(parseInt(this.recipientId)).subscribe({
        next: (user) => {
          this.recipientUsername = user.fullName;
        },
        error: (error) => {
          console.error('Error fetching user information', error);
          this.recipientUsername = null;
        }
      });
    } else {
      this.recipientUsername = null;
    }
  }
}

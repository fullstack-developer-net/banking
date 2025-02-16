import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TransactionsService } from '../../shared/services/transactions/transactions.service';
import { TransferModel } from '../../shared/models/transaction.model';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../../shared/services/accounts/accounts.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { NgToastModule, NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-money-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent, NgToastModule],
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.scss'
})
export class MoneyTransferComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() closeModal = new EventEmitter<any>();
  senderId: string;
  recipientId?: number | null = null;
  amount: number = 0;
  transactionSuccess: boolean = false;
  transactionError: boolean = false;
  recipientUsername: string | null = null;
  showConfirmModal: boolean = false;

  constructor(
    private transactionsService: TransactionsService,
    private accountsService: AccountsService,
    private authService: AuthService,
    private appState: AppStateManager,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {}
  cancelTransaction() {
    this.showConfirmModal = false;

  }

  createTransaction() {
    this.showConfirmModal = true;
    console.log('createTransaction called, showConfirmModal:', this.showConfirmModal);
  }

    resetForm() {
    this.recipientId = null;
    this.amount = 0;
    this.recipientUsername = null;
  }
  confirmTransaction() {
    if (this.amount <= 0) {
      this.toast.danger('Amount must be greater than 0', '', 5000);
      this.showConfirmModal = false;
      return;
    }

    if (!this.recipientId) {
      this.toast.warning('Recipient ID is required', 'Warning', 5000);
      this.showConfirmModal = false;
      this.resetForm();
      return;
    }

    if (this.appState.currentAccount?.accountId === this.recipientId) {
      this.toast.warning('You cannot transfer money to yourself', 'Warning', 5000);
      this.showConfirmModal = false;
      this.resetForm();
      return;
    }

    const transaction: TransferModel = {
      toAccountId: this.recipientId,
      amount: this.amount
    };

    this.transactionsService.createTransaction(transaction).subscribe({
      next: (response) => {
        console.log('Transaction created successfully:', response);
        this.toast.success('Transaction created successfully');
        this.showConfirmModal = false;
        this.resetForm();

      },
      error: (error) => {
        console.error('Error creating transaction', error);
        this.toast.danger('Failed to create transaction');
      }
    });
  }

  getUserInfoByAccountId() {
    if (this.recipientId) {
      this.authService.getUserByAccountId(this.recipientId).subscribe({
        next: (user) => {
          this.recipientUsername = user.fullName;
        },
        error: (error) => {
          console.error('Error fetching user information', error);
          this.toast.danger('Failed to fetch user information');
          this.recipientUsername = null;
        }
      });
    } else {
      this.recipientUsername = null;
    }
  }
}

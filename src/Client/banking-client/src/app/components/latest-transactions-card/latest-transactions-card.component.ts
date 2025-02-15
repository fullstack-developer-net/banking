import { Component } from '@angular/core';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { TransactionsService } from 'src/app/shared/services/transactions/transactions.service';
import { TransactionModel } from 'src/app/shared/models/transaction.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

@Component({
  selector: 'app-latest-transactions-card',
  standalone: true,
  imports: [TransactionItemComponent, CommonModule, FormsModule],
  templateUrl: './latest-transactions-card.component.html',
  styleUrl: './latest-transactions-card.component.scss'
})
export class LatestTransactionsCardComponent {
  ListGroup: TransactionModel[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private transactionService: TransactionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLatestTransactions();
  }

  loadLatestTransactions(): void {
    this.isLoading = true;
    this.error = null;

    this.transactionService.getTransactions({
      pageNumber: 1,  // Always get first page
      pageSize: this.pageSize,
      searchTerm: '',
    }).subscribe({
      next: (response) => {
        this.ListGroup = response.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching latest transactions:', error);
        this.error = 'Failed to load transactions';
        this.isLoading = false;
      }
    });
  }

  viewAllTransactions(): void {
    this.router.navigate(['/transactions']);
  }
}

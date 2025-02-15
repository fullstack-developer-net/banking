import { Component } from '@angular/core';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { TransactionsService } from 'src/app/shared/services/transactions/transactions.service';
import { TransactionModel } from 'src/app/shared/models/transaction.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private transactionService: TransactionsService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.error = null;

    this.transactionService.getTransactions({
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm
    }).subscribe(
      (response) => {
        this.ListGroup = response.items;
        this.totalItems = response.totalCount;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
        this.error = 'Failed to load transactions. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to first page when searching
    this.loadTransactions();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }
}

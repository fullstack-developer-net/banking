import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from 'src/app/shared/services/transactions/transactions.service';
import { TransactionModel } from 'src/app/shared/models/transaction.model';

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  transactions: TransactionModel[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  sortConfig: SortConfig = {
    column: '',
    direction: 'asc'
  };

  constructor(private transactionService: TransactionsService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getTransactions({
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm
    }).subscribe({
      next: (response) => {
        this.transactions = response.items;
        this.totalItems = response.totalCount;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.error = 'Failed to load transactions';
        this.isLoading = false;
      }
    });
  }

  sortData(column: string): void {
    if (this.sortConfig.column === column) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.column = column;
      this.sortConfig.direction = 'asc';
    }

    this.transactions.sort((a: TransactionModel, b: TransactionModel) => {
      const direction = this.sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (column) {
        case 'transactionId':
          return direction * a.transactionId.localeCompare(b.transactionId);
        case 'amount':
          return direction * (Number(a.amount) - Number(b.amount));
        case 'status':
          return direction * a.status.localeCompare(b.status);
        case 'transactionTime':
          return direction * (new Date(a.transactionTime).getTime() - new Date(b.transactionTime).getTime());
        case 'fromAccount':
          return direction * (a.fromAccount?.fullName || '').localeCompare(b.fromAccount?.fullName || '');
        case 'toAccount':
          return direction * (a.toAccount?.fullName || '').localeCompare(b.toAccount?.fullName || '');
        default:
          return 0;
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortConfig.column !== column) return '';
    return this.sortConfig.direction === 'asc' ? '↑' : '↓';
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
import { Component } from '@angular/core';
import { AccountItemComponent } from '../account-item/account-item.component';
import { CommonModule } from '@angular/common';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-account',
  standalone: true,
  imports: [CommonModule, AccountItemComponent, FormsModule],
  templateUrl: './list-account-card.component.html',
  styleUrl: './list-account-card.component.scss'
})
export class ListAccountCardComponent {
  ListGroup : any;
  filteredAccounts: any;
  isLoading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.error = null;

    this.accountsService.getListAccounts()
      .subscribe({
        next: (data: any) => {
          this.ListGroup = data.items;
          this.filterAccounts();
          this.isLoading = false;
          console.info('Loading data accounts:', data);
        },
        error: (error) => {
          console.error('Error fetching accounts:', error);
          this.error = 'Failed to load accounts. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  filterAccounts(): void {
    if (!this.searchTerm) {
      this.filteredAccounts = [...this.ListGroup];
    } else {
      const search = this.searchTerm.toLowerCase();
      this.filteredAccounts = this.ListGroup.filter(account => 
        account.fullName.toLowerCase().includes(search) ||
        account.accountNumber.toLowerCase().includes(search)
      );
    }
    this.totalItems = this.filteredAccounts.length;
    this.currentPage = 1; // Reset to first page when filtering
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterAccounts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get paginatedAccounts(): any {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAccounts.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}

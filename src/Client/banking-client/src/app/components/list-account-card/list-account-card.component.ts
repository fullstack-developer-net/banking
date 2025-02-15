import { Component } from '@angular/core';
import { AccountItemComponent } from '../account-item/account-item.component';
import { CommonModule } from '@angular/common';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

interface AccountForm {
  fullName: string;
  email: string;
  initialBalance: number;
}

@Component({
  selector: 'app-list-account',
  standalone: true,
  imports: [CommonModule, AccountItemComponent, FormsModule, ReactiveFormsModule],
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

  showAddAccountModal: boolean = false;
  accountForm: FormGroup;

  constructor(
    private accountsService: AccountsService,
    private fb: FormBuilder
  ) {
    this.accountForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      initialBalance: [0, [Validators.required, Validators.min(0)]]
    });
  }

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

  openAddAccountModal(): void {
    this.showAddAccountModal = true;
    this.accountForm.reset({
      fullName: '',
      email: '',
      initialBalance: 0
    });
  }

  closeAddAccountModal(): void {
    this.showAddAccountModal = false;
  }

  onSubmitAccount(): void {
    if (this.accountForm.valid) {
      this.isLoading = true;
      const accountData: AccountForm = this.accountForm.value;

      this.accountsService.createAccount(accountData).subscribe({
        next: () => {
          this.loadAccounts();
          this.closeAddAccountModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating account:', error);
          this.error = 'Failed to create account. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  get formControls() {
    return this.accountForm.controls;
  }
}

import { Component } from '@angular/core';
import { AccountItemComponent } from '../account-item/account-item.component';
import { CommonModule } from '@angular/common';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextInputComponent } from "../../core/components/text-input/text-input.component";
import { emailExistsAsyncValidator } from 'src/app/shared/utils/validation.util';
import { SignalRService } from '../../shared/services/signalr/signalr.service';
import { SignalREventType } from 'src/app/shared/enums/event-type.enum';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

interface AccountForm {
  isAdmin: boolean;
  fullName: string;
  email: string;
  initialBalance: number;
}

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-list-account',
  standalone: true,
  imports: [CommonModule, AccountItemComponent, FormsModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './list-account-card.component.html',
  styleUrl: './list-account-card.component.scss'
})
export class ListAccountCardComponent {
  ListGroup: any;
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

  sortConfig: SortConfig = {
    column: '',
    direction: 'asc'
  };

  constructor(
    private accountsService: AccountsService,
    private fb: FormBuilder,
    private router: Router,
    private signalRService: SignalRService,
    private auth: AuthService
  ) {
    this.accountForm = this.fb.group({
      isAdmin: [false],
      fullName: ['', [Validators.required, Validators.minLength(3)],],
      email: ['', [Validators.required, Validators.email], [emailExistsAsyncValidator(auth)]],
      initialBalance: [0, [Validators.required, Validators.min(0)]]
    });
  }
 
  get isFormValid(): boolean {
    return (
      this.accountForm.valid ||
      (this.accountForm.value.isAdmin && this.accountForm.get('fullName')?.valid && this.accountForm.get('email')?.valid)
    );
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.signalRService.eventMessageStream$.subscribe((message) => {
      switch (message.type) {
        case SignalREventType.AccountCreated:
        case SignalREventType.AccountDeleted:
          this.loadAccounts();
          break;
        default:
          break;
      }
    });

  }

  loadAccounts(): void {
    this.isLoading = true;
    this.error = null;

    this.accountsService.getListAccounts().subscribe({
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
      this.filteredAccounts = this.ListGroup.filter(
        (account) => account.fullName.toLowerCase().includes(search) || account.accountNumber.toLowerCase().includes(search)
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
      // Scroll to top of table when page changes
      const tableContainer = document.querySelector('.table-container');
      if (tableContainer) {
        tableContainer.scrollTop = 0;
      }
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
      if (accountData.isAdmin) {
        accountData.initialBalance = 0;
      }

      this.accountsService
        .createAccount({
          isAdmin: accountData.isAdmin ?? false,
          fullName: accountData.fullName,
          email: accountData.email,
          initialBalance: accountData.initialBalance ?? 0
        })
        .subscribe({
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
  navigateToAccountDetail(accountId: string): void {
    this.router.navigate(['/account-detail', accountId]); // Điều hướng đến trang chi tiết
  }
  get formControls() {
    return this.accountForm.controls;
  }

  sortData(column: string): void {
    if (this.sortConfig.column === column) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.column = column;
      this.sortConfig.direction = 'asc';
    }

    this.filteredAccounts.sort((a: any, b: any) => {
      const direction = this.sortConfig.direction === 'asc' ? 1 : -1;

      switch (column) {
        case 'accountNumber':
          return direction * a.accountNumber.localeCompare(b.accountNumber);
        case 'fullName':
          return direction * a.fullName.localeCompare(b.fullName);
        case 'balance':
          return direction * (a.balance - b.balance);
        default:
          return 0;
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortConfig.column !== column) return '';
    return this.sortConfig.direction === 'asc' ? '▲' : '▼';
  }
}

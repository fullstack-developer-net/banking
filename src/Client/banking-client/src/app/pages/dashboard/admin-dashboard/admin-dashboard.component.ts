import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AccountModel } from 'src/app/shared/models/account.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { ListAccountCardComponent } from 'src/app/components/list-account-card/list-account-card.component';
import { Router } from '@angular/router';
import { LatestTransactionsCardComponent } from 'src/app/components/latest-transactions-card/latest-transactions-card.component';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule,
    SharedModule,
    ListAccountCardComponent,
    LatestTransactionsCardComponent
  ]
})
export class AdminDashboardComponent implements OnInit {
  totalActiveAccounts: number = 0;
  totalInactiveAccounts: number = 0;
  totalAdmins: number = 0;
  profileCard = [
    {
      style: 'bg-primary-dark text-white',
      background: 'bg-primary',
      value: '$203k',
      text: 'Net Profit',
      color: 'text-white',
      value_color: 'text-white'
    },
    {
      background: 'bg-warning',
      avatar_background: 'bg-light-warning',
      value: '$550K',
      text: 'Total Revenue',
      color: 'text-warning'
    }
  ];
  account: AccountModel | null = null;

  constructor(
    private appState: AppStateManager,
    private matDialog: MatDialog,
    private router: Router,
    private accountsService: AccountsService
  ) {}


 
  ngOnInit(): void {
    if(this.appState.currentAuth === null) {
      this.router.navigateByUrl('/login');
    }
    this.account = this.appState.currentAccount;
    console.log('Account:', this.account);
   this.loadStatistical();
  }

  showModal() {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '600px',
      height: '400px',
      data: { name: 'Account Info' }

    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
   }
  
   loadStatistical(): void {
    this.accountsService.getStatistical()
      .subscribe({
        next: (data: any) => {
          this.totalActiveAccounts = data.TotalActiveAccounts;
          this.totalInactiveAccounts = data.TotalInactiveAccounts;
          this.totalAdmins = data.TotalAdmins;
          console.info('Loading statistical data:', data);
        },
        error: (error) => {
          console.error('Error fetching statistical data:', error);
        }
      });
  }
}

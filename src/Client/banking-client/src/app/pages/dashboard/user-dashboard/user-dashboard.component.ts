// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// project import
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AccountModel } from 'src/app/shared/models/account.model';
import { AccountBalanceCardComponent } from 'src/app/components/account-balance-card/account-balance-card.component';
import { BankAccountCardComponent } from 'src/app/components/bank-account-card/bank-account-card.component';
import { LatestTransactionsCardComponent } from 'src/app/components/latest-transactions-card/latest-transactions-card.component';
import { SummaryChartComponent } from 'src/app/components/summary-chart/summary-chart.component';
import { MoneyTransferComponent } from 'src/app/components/money-transfer/money-transfer.component';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    BankAccountCardComponent,
    LatestTransactionsCardComponent,
    AccountBalanceCardComponent,
    SummaryChartComponent,
    MoneyTransferComponent,
    MatDialogModule
  ],

  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  // public method

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
  showMoneyTransfer: boolean = false;

  constructor(
    private appState: AppStateManager,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.appState.currentAuth === null) {
      this.router.navigateByUrl('/login');
    }
  }

  showMoneyTransferPopup(): void {
     this.showMoneyTransfer = true;
 
  }
  onShowMoneyTransferingClosed() {
    this.showMoneyTransfer = false;
  }
  onButtonCliked() {}
}

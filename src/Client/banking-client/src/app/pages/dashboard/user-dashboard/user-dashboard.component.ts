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
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { SignalRService } from 'src/app/shared/services/signalr/signalr.service';
import { SignalREventType } from 'src/app/shared/enums/event-type.enum';
import { EventData } from 'src/app/shared/models/event.model';
import { TransactionModel } from 'src/app/shared/models/transaction.model';

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
  income: number = 0;
  expenditure: number = 0;
  // public method
 
  account: AccountModel | null = null;
  showMoneyTransfer: boolean = false;

  constructor(
    private appState: AppStateManager,
    private router: Router,
    private accountsService: AccountsService,
    private signalrService: SignalRService,

  ) {}

  ngOnInit(): void {
    if (this.appState.currentAuth === null) {
      this.router.navigateByUrl('/login');
    }
    this.loadStatistical();
    this.signalrService.hubConnection.on('event', (eventData: EventData) => {
      var data = eventData.data as TransactionModel;
      if (
        ((this.appState?.currentRole == 'Admin' ||
          this.appState?.currentAccount.accountId === data.fromAccountId ||
          this.appState?.currentAccount.accountId === data.toAccountId) &&
          eventData.type === SignalREventType.TransactionCreated) ||
        eventData.type === SignalREventType.TransactionCompleted ||
        eventData.type === SignalREventType.TransactionFailed
      ) {
        this.loadStatistical();
      }
    });
  }

  showMoneyTransferPopup(): void {
     this.showMoneyTransfer = true;
 
  }
  onShowMoneyTransferingClosed() {
    this.showMoneyTransfer = false;
  }

  onButtonCliked() {}

  loadStatistical(): void {
    this.accountsService.getStatistical()
      .subscribe({
        next: (data: any) => {
          this.expenditure = data.SpendingThisMonth;
          this.income = data.ReceivingThisMonth;
          console.info('Loading statistical data:', data);
        },
        error: (error) => {
          console.error('Error fetching statistical data:', error);
        }
      });
  }
}

// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BankAccountCardComponent } from '../../bank-account-card/bank-account-card.component';
import { AccountBalanceCardComponent } from '../../account-balance-card/account-balance-card.component';
import { LatestTransactionsCardComponent } from '../../latest-transactions-card/latest-transactions-card.component';
import { SummaryChartComponent } from '../../summary-chart/summary-chart.component';
import { MoneyTransferComponent } from '../../money-transfer/money-transfer.component';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AccountsService } from '../../../shared/services/accounts/accounts.service';
import { AuthModel } from 'src/app/shared/models/auth.model';
import { switchMap } from 'rxjs';
import { AccountModel } from 'src/app/shared/models/account.model';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    SharedModule,
    BankAccountCardComponent,
    LatestTransactionsCardComponent,
    AccountBalanceCardComponent,
    SummaryChartComponent,
    MoneyTransferComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
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
  constructor(private appState: AppStateManager) {}

  ngOnInit(): void {
    this.appState.account$.subscribe((account: any) => {
      this.account = account;
      console.log('Account : ', account);
    });
  }
}

// Angular Import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BankAccountCardComponent } from '../../bank-account-card/bank-account-card.component';
import { AccountBalanceCardComponent } from '../../account-balance-card/account-balance-card.component';
import { LatestTransactionsCardComponent } from '../../latest-transactions-card/latest-transactions-card.component';
import { SummaryChartComponent } from '../../summary-chart/summary-chart.component';
import { ServicesModule } from 'src/app/shared/services/services.module';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    SharedModule,
    BankAccountCardComponent,
    LatestTransactionsCardComponent,
    AccountBalanceCardComponent,
    SummaryChartComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
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
}

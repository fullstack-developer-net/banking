import { Component, OnInit } from '@angular/core';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AccountModel } from 'src/app/shared/models/account.model';

@Component({
  selector: 'app-summary-chart',
  imports: [],
  templateUrl: './summary-chart.component.html',
  styleUrl: './summary-chart.component.scss'
})
export class SummaryChartComponent implements OnInit {
  account: AccountModel;
  constructor(private appState: AppStateManager) {}

  ngOnInit(): void {
    this.appState.account$.subscribe((account: any) => {
      this.account = account;
      console.log('SummaryChartComponent Account:', this.account);
    });
  }
}

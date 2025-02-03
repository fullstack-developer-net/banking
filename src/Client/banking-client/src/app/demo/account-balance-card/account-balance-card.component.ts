import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AccountModel } from 'src/app/shared/models/account.model';

@Component({
  selector: 'app-account-balance-card',
  imports: [SharedModule],
  templateUrl: './account-balance-card.component.html',
  styleUrl: './account-balance-card.component.scss'
})
export class AccountBalanceCardComponent {
  account?: AccountModel;
  constructor(private appState: AppStateManager) {
    this.appState.account$.subscribe((account: AccountModel) => {
      this.account = account;
      console.log('Account Balance Card: ', account);
    });
  }

  accountBalance: number = 0;
}

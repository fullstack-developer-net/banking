import { Component } from '@angular/core';
import { AuthModel } from 'src/app/shared/models';
import { CreditCardNumberPipe } from 'src/app/shared/pipes/credit-card-number.pipe';
 import { AccountsService } from '../../shared/services/accounts/accounts.service';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { UpperCasePipe } from '@angular/common';
import { AccountModel } from 'src/app/shared/models/account.model';

@Component({
  selector: 'app-bank-account-card',
  imports: [CreditCardNumberPipe, UpperCasePipe],
  templateUrl: './bank-account-card.component.html',
  styleUrl: './bank-account-card.component.scss'
})
export class BankAccountCardComponent {
  auth: AuthModel | null = null;
  accountNumber: string = '1234 5678 9012 12';
  accountBalance: any = 3400;
  account: AccountModel | null = null;
  // account$: Observable<AuthModel | null> = this.authService.auth$;

  constructor(
    private appState: AppStateManager,
  ) {
    this.appState.auth$.subscribe((auth: AuthModel | null) => {
      this.auth = auth;
    });

    this.appState.account$.subscribe((account: any) => {
      this.account = account;
    });
  }
}

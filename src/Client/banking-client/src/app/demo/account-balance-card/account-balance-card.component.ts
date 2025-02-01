import { Component } from '@angular/core';
import { AccountsService } from '../../shared/services/accounts/accounts.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-account-balance-card',
  imports: [SharedModule],
  templateUrl: './account-balance-card.component.html',
  styleUrl: './account-balance-card.component.scss'
})
export class AccountBalanceCardComponent {
  constructor(private accountsService: AccountsService) {}

  accountBalance: number = 0;
}

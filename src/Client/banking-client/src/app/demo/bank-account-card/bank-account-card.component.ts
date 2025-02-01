import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { AuthModel } from 'src/app/shared/models';
import { CreditCardNumberPipe } from 'src/app/shared/pipes/credit-card-number.pipe';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-bank-account-card',
  imports: [SharedModule, CreditCardNumberPipe],
  templateUrl: './bank-account-card.component.html',
  styleUrl: './bank-account-card.component.scss'
})
export class BankAccountCardComponent {
  auth: AuthModel | null = null;
  accountNumber: string = '1234 5678 9012 12';
  accountBalance: any = 3400;
  constructor(private authService: AuthService) {
    this.authService.auth$.subscribe((auth: AuthModel | null) => {
      this.auth = auth;
    });
  }
}

import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { AppStateManager } from './shared/app.state-manager';
import { AccountsService } from './shared/services/accounts/accounts.service';
import { AuthModel } from './shared/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent],
  providers: []
})
export class AppComponent {
  title = 'Simple Banking App';

  constructor(private appState: AppStateManager, private router: Router, private accountService: AccountsService) {
    console.log('App State : ', appState);
  }

  ngOnInit(): void {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
      const parsedAuth = JSON.parse(auth) as AuthModel;
      this.appState.setAuth(parsedAuth);
      if (parsedAuth.roles.includes('User')) {
        this.accountService.getAccountByUserId(parsedAuth.userId).subscribe({
        next: (account) => this.appState.setAccount(account),
        error: (err) => console.error('Failed to fetch account:', err)
        });
      }
      } catch (error) {
        console.error('Failed to parse auth:', error);
      }
    }
  }
  
}

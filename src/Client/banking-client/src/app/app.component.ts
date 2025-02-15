import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { AppStateManager } from './shared/app.state-manager';
import { AccountsService } from './shared/services/accounts/accounts.service';
import { AuthModel } from './shared/models';
import { SignalRService } from './shared/services/signalr/signalr.service';
import { NgToastModule } from 'ng-angular-popup';
import { NgToastService, ToasterPosition, ToastType } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent, NgToastModule],
  providers: []
})
export class AppComponent {
  title = 'Simple Banking App';
  ToasterPosition = ToasterPosition;
  constructor(
    private appState: AppStateManager,
    private router: Router,
    private accountService: AccountsService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    const auth = localStorage.getItem('auth');
    this.signalRService.startConnection();

    if (auth) {
      const parsedAuth = JSON.parse(auth) as AuthModel;

      let validUser = true; // Should validate token and refresh token if needs
      if (!parsedAuth || !validUser) {
        this.appState.setAuth(null);
        localStorage.removeItem('auth');
        this.router.navigateByUrl('/login');
      } else {
        try {
          this.appState.setAuth(parsedAuth);

          if (parsedAuth.roles.includes('Admin')) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
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
}

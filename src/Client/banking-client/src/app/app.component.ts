import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { AppStateManager } from './shared/app.state-manager';
import { AccountsService } from './shared/services/accounts/accounts.service';
import { AuthModel } from './shared/models';
import { SignalRService } from './shared/services/signalr/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent],
  providers: []
})
export class AppComponent {
  title = 'Simple Banking App';
  public messages: string[] = [];

  constructor(private appState: AppStateManager, private router: Router, private accountService: AccountsService,private signalRService: SignalRService) {
    console.log('App State : ', appState);
  }

  async ngOnInit(): Promise<void> {
    const auth = localStorage.getItem('auth');
    this.signalRService.startConnection();

    this.signalRService.messageReceived$.subscribe(message => {
      this.messages.push(message);
    });
    if (auth) {
      const parsedAuth = JSON.parse(auth) as AuthModel;
 
      try {
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

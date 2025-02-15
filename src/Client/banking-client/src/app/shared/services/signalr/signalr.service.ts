import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { TransactionsService } from '../transactions/transactions.service';
import { EventData } from '../../models/event.model';
import { AppStateManager } from '../../app.state-manager';
import { TransactionModel } from '../../models/transaction.model';
import { AccountsService } from '../accounts/accounts.service';
import { SignalREventType } from '../../enums/event-type.enum';
 
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  private eventMessageSubject = new Subject<EventData>();
  public messageReceived$ = this.eventMessageSubject.asObservable();

  url = environment.apiUrl + '/eventhub';

  constructor(
    private transactionsService: TransactionsService,
    private accountsService: AccountsService,
    private appState: AppStateManager
  ) {}

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Hub connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));

 
    this.hubConnection.on('event', (data: EventData) => {
      this.eventMessageSubject.next(data);
      this.handleEventMessage(data);
    });
  }

  public sendMessage(message: string): void {
    this.hubConnection.send('sendMessage', message).catch((err) => console.log('Error while sending message: ' + err));
  }

  handleEventMessage(eventData: EventData) {

    switch (eventData.type) {
      case SignalREventType.TransactionCreated:
        break;
      case SignalREventType.TransactionCompleted:
        break;
      case SignalREventType.TransactionFailed:
        break;
      case SignalREventType.AccountCreated:
      case SignalREventType.AccountUpdated:
        
        break;
      case SignalREventType.AccountDeleted:
      default:
        break;
    }

    const data = eventData.data as TransactionModel;

    if (this.appState.currentRole === 'User' && [data.fromAccountId, data.toAccountId].includes(this.appState.currentAccount?.id)) {
      this.accountsService.getAccountById(this.appState.currentAccount.id).subscribe({
        next: (account) => this.appState.setAccount(account),
        error: (err) => console.error('Failed to fetch account:', err)
      });
    }
  }
}
import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { EventData } from '../../models/event.model';
import { AppStateManager } from '../../app.state-manager';
import { TransactionModel } from '../../models/transaction.model';
import { AccountsService } from '../accounts/accounts.service';
import { SignalREventType } from '../../enums/event-type.enum';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public readonly hubConnection: signalR.HubConnection;

  private eventMessageSubject = new Subject<EventData>();
  public eventMessageStream$ = this.eventMessageSubject.asObservable();

  url = environment.apiUrl + '/eventhub';

  constructor(
    private accountsService: AccountsService,
    private appState: AppStateManager,
    private toast: NgToastService
  ) {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.url, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withKeepAliveInterval(3000)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

    this.initializeSignalR();
  }
  startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('Hub connection started'))
      .catch((err) => {
        console.error('Error while starting connection: ' + err);
        setTimeout(() => this.startConnection(), 3000);  
      });
  }
  
  initializeSignalR() {
    this.hubConnection.onclose(() => {
      console.error('SignalR connection closed');
      setTimeout(() => this.startConnection(), 3000);  
    });
  
    this.hubConnection.onreconnecting((error) => {
      console.warn('SignalR reconnecting:', error);
      this.toast.warning('Warning', 'Reconnecting to the server...');
    });
  
    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected. Connection ID: ', connectionId);
      this.toast.success('Success', 'Reconnected to the server');
    });

    this.hubConnection.on('event', (eventData: EventData) => {
      this.eventMessageSubject.next(eventData);
      this.handleEventMessage(eventData);
    });

    this.startConnection();
  }

  public sendMessage(message: string): void {
    this.hubConnection.send('sendMessage', message).catch((err) => console.log('Error while sending message: ' + err));
  }

  handleEventMessage(eventData: EventData) {
    console.log('Event received:', eventData);
    switch (eventData.type) {
      case SignalREventType.TransactionCreated:
        this.refreshAccount();
        break;
      case SignalREventType.TransactionCompleted:
        this.refreshAccount();
        this.onTransactionCompleted(eventData);
        break;
      case SignalREventType.TransactionFailed:
        this.refreshAccount();
        this.onTransactionFailed(eventData);
        break;
      case SignalREventType.AccountCreated:
      case SignalREventType.AccountUpdated:
      case SignalREventType.AccountDeleted:
      default:
        break;
    }
  }

  onTransactionFailed(eventData: EventData) {
    const data = eventData.data as TransactionModel;
    if (data.fromAccountId === this.appState.currentAccount?.accountId) {
      this.toast.danger('Money transfer failed', `Transfer failed: $${data.amount}`,5000);
    }
  }
  onTransactionCompleted(eventData: EventData) {
    const data = eventData.data as TransactionModel;
    if (data.toAccountId === this.appState.currentAccount?.accountId) {
      this.toast.info('Transaction', `${data.fromAccount?.fullName} transfered to you: $${data.amount}`, 5000);
    } else if (data.fromAccountId === this.appState.currentAccount?.accountId) {
      this.toast.info('Transaction', `You transfered to ${data.toAccount?.fullName}: $${data.amount}`, 5000);
    }
  }

  handleTransactionEvent(eventData: EventData) {
    const data = eventData.data as TransactionModel;
  }

  refreshAccount() {
    this.accountsService.getAccountById(this.appState.currentAccount?.accountId).subscribe({
      next: (account) => {
        this.appState.setAccount(account);
        console.log('Account refreshed:', account);
      },
      error: (error) => {
        console.error('Error refreshing account', error);
      }
    });
  }
}



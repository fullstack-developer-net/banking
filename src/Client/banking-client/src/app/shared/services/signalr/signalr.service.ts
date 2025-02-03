import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  private messageReceivedSubject = new Subject<string>();
  public messageReceived$ = this.messageReceivedSubject.asObservable();

  constructor() {}

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7101/eventhub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Hub connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('receiveMessage', (data: string) => {
      console.log('Received message: ' + data);
      this.messageReceivedSubject.next(data);
    });
  }

  public sendMessage(message: string): void {
    this.hubConnection.send('sendMessage', message)
      .catch((err) => console.log('Error while sending message: ' + err));
  }
}
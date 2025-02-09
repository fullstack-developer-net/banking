import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AccountModel } from 'src/app/shared/models/account.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { ListAccountCardComponent } from 'src/app/components/list-account-card/list-account-card.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, SharedModule,ListAccountCardComponent]
})
export class AdminDashboardComponent implements OnInit {
  profileCard = [
    {
      style: 'bg-primary-dark text-white',
      background: 'bg-primary',
      value: '$203k',
      text: 'Net Profit',
      color: 'text-white',
      value_color: 'text-white'
    },
    {
      background: 'bg-warning',
      avatar_background: 'bg-light-warning',
      value: '$550K',
      text: 'Total Revenue',
      color: 'text-warning'
    }
  ];
  account: AccountModel | null = null;

  constructor(
    private appState: AppStateManager,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.appState.account$.subscribe((account: any) => {
      this.account = account;
      console.log('Account : ', account);
    });
  }

  showModal() {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '600px',
      height: '400px',
      data: { name: 'Account Info' }

    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
   }
}

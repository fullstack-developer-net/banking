import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AppStateManager } from './shared/app.state-manager';
import { SharedModule } from './shared/shared.module';
import { SignalRService } from './shared/services/signalr/signalr.service';
import { RoleGuard } from './shared/guard/role.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth/auth.interceptor';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { AccountDetailComponent } from './components/account-detail/account-detail.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'user',
        loadComponent: () => import('./pages/dashboard/user-dashboard/user-dashboard.component').then((m) => m.UserDashboardComponent),
        data: { roles: ['User'] }
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/dashboard/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
        data: { roles: ['Admin'] }
      },
      {
        path: 'user-detail',
        component: UserDetailComponent
      },
      {
        path: 'transactions',
        component: TransactionListComponent
      },
      { path: 'account-detail/:accountId', component: AccountDetailComponent },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
    ]
  },

  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), SharedModule, MatDialogModule, BrowserAnimationsModule, NgToastModule],
  exports: [RouterModule],
  providers: [
    AppStateManager,
    SignalRService,
    MatDialog,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    NgToastService,
  ]
})
export class AppRoutingModule {}

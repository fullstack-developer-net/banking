import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AppStateManager } from './shared/app.state-manager';
import { SharedModule } from './shared/shared.module';
import { SignalRService } from './shared/services/signalr/signalr.service';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/user',
        pathMatch: 'full'
      },
      {
        path: 'user',
        loadComponent: () => import('./pages/dashboard/default/default.component').then((m) => m.DefaultComponent)
      } ,
      {
        path: 'admin',
        loadComponent: () => import('./pages/dashboard/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
      },
    ]
  },
 
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule],
  providers: [AppStateManager,SignalRService]
})
export class AppRoutingModule {}

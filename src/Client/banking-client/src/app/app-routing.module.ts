import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AppStateManager } from './shared/app.state-manager';
import { SharedModule } from './shared/shared.module';
import { SignalRService } from './shared/services/signalr/signalr.service';
import { HotToastService } from '@ngxpert/hot-toast';
 
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
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule],
  providers: [AppStateManager,SignalRService,HotToastService]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AppStateManager } from './shared/app.state-manager';
import { SharedModule } from './shared/shared.module';
import { SignalRService } from './shared/services/signalr/signalr.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { RoleGuard } from './shared/guard/role.guard';
 
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'user',
        loadComponent: () => import('./pages/dashboard/default/default.component').then((m) => m.DefaultComponent),
        data: { roles: ['User'] }
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/dashboard/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
        data: { roles: ['Admin'] }
      }
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
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule],
  providers: [AppStateManager,SignalRService,HotToastService,RoleGuard]
})
export class AppRoutingModule {}

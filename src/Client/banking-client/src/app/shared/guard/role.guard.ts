// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppStateManager } from '../app.state-manager';
 
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private appStateManager: AppStateManager, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    console.log('RoleGuard called', route.data['roles']);
    const userRole = this.appStateManager.currentRole;
    const expectedRoles = route.data['roles'] as string[];

    if (userRole) {
      if (expectedRoles.includes(userRole)) {
        this.router.navigateByUrl('/' + userRole.toLowerCase());
        return true;
      } else {
        this.router.navigate(['/login']);
         return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
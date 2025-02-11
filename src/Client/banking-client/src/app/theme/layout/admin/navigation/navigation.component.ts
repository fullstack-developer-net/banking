// Angular import
import { CommonModule } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import

import { NavContentComponent } from './nav-content/nav-content.component';
import { AppStateManager } from 'src/app/shared/app.state-manager';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NavContentComponent, CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
   
  logout() {
    console.log('logout');
    localStorage.removeItem('auth');
    this.appState.setAuth(null);  
    this.appState.setAccount(null);
    this.router.navigateByUrl('/login');
    
  }
  currentRole: string;
  constructor(private appState: AppStateManager,private router: Router) {}
  ngOnInit(): void {
    this.currentRole = this.appState.currentRole;
  }
  // public props
  NavCollapsedMob = output();
  SubmenuCollapse = output();
  navCollapsedMob = false;
  windowWidth = window.innerWidth;
  themeMode!: string;

  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  navSubmenuCollapse() {
    document.querySelector('app-navigation.coded-navbar')?.classList.add('coded-trigger');
  }
}

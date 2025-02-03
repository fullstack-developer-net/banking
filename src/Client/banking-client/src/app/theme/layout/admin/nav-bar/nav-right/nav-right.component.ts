// Angular import
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AuthModel } from 'src/app/shared/models';
import { SharedModule } from 'src/app/shared/shared.module';
import { getGreeting } from 'src/app/shared/utils/user.util';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, CommonModule, NgScrollbarModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  get greating() {
    return getGreeting();
  }
  auth?: AuthModel | null;
  constructor(private appState: AppStateManager) {}
  ngOnInit(): void {
    this.appState.account$.subscribe((auth: any) => {
      this.auth = auth;
    });
  }
}

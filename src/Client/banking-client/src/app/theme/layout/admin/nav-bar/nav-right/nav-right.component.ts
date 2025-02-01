// Angular import
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModel } from 'src/app/shared/models';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { getGreeting } from 'src/app/shared/utils/user.util';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  get greating() {
    return getGreeting();
  }
  auth?: AuthModel | null;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.auth$.subscribe((auth: AuthModel | null) => {
      this.auth = auth;
    });
  }
}

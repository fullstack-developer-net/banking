import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { AuthModule } from 'src/app/shared/services/auth/auth.module';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CoreModule, AuthModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  /**
   * A form group for the login form, containing two form controls:
   * - `username`: A required field with a minimum length of 6 characters.
   * - `password`: A required field with a minimum length of 6 characters.
   */
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit($event: any) {
    this.auth.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((result) => {
      console.log(result);
    });
  }
}

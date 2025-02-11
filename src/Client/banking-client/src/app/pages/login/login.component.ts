import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { TextInputComponent } from 'src/app/core/components/text-input/text-input.component';
import { CoreModule } from 'src/app/core/core.module';
import { AppStateManager } from 'src/app/shared/app.state-manager';
import { AuthModel } from 'src/app/shared/models';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
 
import { SignalRService } from 'src/app/shared/services/signalr/signalr.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CoreModule, SharedModule, CommonModule, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private appState: AppStateManager,
    private accountService: AccountsService,
    private signalrService: SignalRService,
  ) {
    this.appState.auth$.pipe(switchMap((auth?: AuthModel) => this.accountService.getAccountByUserId(auth?.userId))).subscribe(
      (account) => {
        this.appState.setAccount(account);
        console.log('Account : ', account);

      },
      (error) => {
        console.error('Error fetching account', error);
      }
    );
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  emailExistsValidator(control: AbstractControl) {
    return this.auth.checkEmailExists(control.value).pipe(map((exists: boolean) => (exists ? { emailExists: true } : null)));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.auth.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((result) => {
      this.router.navigate(['/']);
    });
  }
}

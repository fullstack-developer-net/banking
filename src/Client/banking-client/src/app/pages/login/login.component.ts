import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { switchMap, map, of, tap } from 'rxjs';
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
export class LoginComponent  implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private appState: AppStateManager,
    private accountService: AccountsService,
    private signalrService: SignalRService,
  ) {

  }
  ngOnInit(): void {
    this.appState.auth$
      .pipe(switchMap((auth?: AuthModel) => (auth ? this.accountService.getAccountByUserId(auth.userId) : of(null))))
      .subscribe({
        next: (account) => {
          this.appState.setAccount(account);
        },
        error: (error) => {
          console.error('Error fetching account', error);
        }
      });
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
      console.log('Login result:', result);
      if (result) {
        this.router.navigateByUrl('/' + this.appState.currentRole?.toLowerCase());
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }
}

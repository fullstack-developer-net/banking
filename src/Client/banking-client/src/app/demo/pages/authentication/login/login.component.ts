import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from 'src/app/core/components/text-input/text-input.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CoreModule, SharedModule, CommonModule, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

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

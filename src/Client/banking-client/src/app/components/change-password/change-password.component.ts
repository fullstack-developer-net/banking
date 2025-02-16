import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { TextInputComponent } from "../../core/components/text-input/text-input.component";
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthModel } from 'src/app/shared/models';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  isLoading: boolean = false;
  error: string | null = null;
  success: boolean = false;

  constructor(
    private fb: FormBuilder,
    private accountsService: AccountsService,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.error = null;
      this.success = false;

      const authData = localStorage.getItem('auth');
      let userId;
      if (authData) {
        const authModel: AuthModel = JSON.parse(authData);
        userId = authModel.userId;
      }

      const passwordData = {
        userId,
        ...this.passwordForm.value
      };

      this.accountsService.changePassword(passwordData).subscribe({
        next: () => {
          this.isLoading = false;
          this.success = true;
          this.passwordForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.message || 'Failed to change password. Please try again.';
        }
      });
    }
  }
}
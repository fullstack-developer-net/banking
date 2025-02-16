import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { AuthService } from "../services/auth/auth.service";
import { catchError, map, Observable, of } from "rxjs";

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
export function emailExistsAsyncValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return authService.checkEmailExists(control.value).pipe(
      map(exists => (exists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  };
}

export function emailExistsValidator(existingEmails: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (existingEmails.includes(email)) {
      return { emailExists: true };
    }
    return null;
  };
}
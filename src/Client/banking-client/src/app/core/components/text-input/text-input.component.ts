import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  NG_VALIDATORS,
  Validator,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  imports: [ReactiveFormsModule, NgbModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements Validator {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() currentControl: FormControl;

  errorMessages = [
    { type: 'required', message: 'This field is required.' },
    { type: 'minlength', message: 'Minimum length not met.' },
    { type: 'maxlength', message: 'Maximum length exceeded.' },
    { type: 'pattern', message: 'Invalid format.' }
  ];

  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    throw new Error('Method not implemented.');
  }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}
}
